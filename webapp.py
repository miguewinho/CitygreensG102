import cherrypy
from jinja2 import Environment, PackageLoader, select_autoescape
import os
from datetime import datetime
import json
import pyrebase

#Firebase configuration
config = {
    "apiKey": "AIzaSyBp1RQYJmmlzMrfbC1tjcoHu3aMjFJsRVw",
    "authDomain": "citygreens-ef58a.firebaseapp.com",
    "databaseURL": "https://citygreens-ef58a.firebaseio.com",
    "storageBucket": "citygreens-ef58a.appspot.com",
}

firebase = pyrebase.initialize_app(config)

class WebApp(object):

    def __init__(self):
        self.env = Environment(
                loader=PackageLoader('webapp', 'templates'),
                autoescape=select_autoescape(['html', 'xml'])
                )

########################################################################################################################
#   Utilities

    def set_user(self, username=None):
        if username == None:
            cherrypy.session['user'] = {
                'is_authenticated': False, 
                'username': '',
                'cart' : []
            }
        else:
            cherrypy.session['user'] = {
                'is_authenticated': True,
                'username': username,
                'cart' : []
            }

    def get_user(self):
        if not 'user' in cherrypy.session:
            self.set_user()
        return cherrypy.session['user']

    def render(self, tpg, tps):
        template = self.env.get_template(tpg)
        return template.render(tps)
    
    def do_authenticationFirebase(self, usr, pwd):
        db = firebase.database()
        users = db.child("users").get()

        for user in users.each():
            if user.val()["email"] == usr and user.val()["password"] == pwd:
                self.set_user(user.val()["name"])

    def do_registrationFirebase(self, name, username, email, number, addr, zipcode, pwd):
        db = firebase.database()
        users = db.child("users").get()

        data = {
            "name": name,
            "username": username,
            "email": email,
            "phone_number": number,
            "address": addr,
            "zip_code": zipcode,
            "password": pwd
        }

        db.child("users").push(data)

########################################################################################################################
#   Controllers

    @cherrypy.expose
    def index(self):
        tparams = {
            'user': self.get_user(),
            'year': datetime.now().year,
        }
        return self.render('index.html', tparams)


    @cherrypy.expose
    def about(self):
        tparams = {
            'title': 'About',
            'message': 'Your application description page.',
            'user': self.get_user(),
            'year': datetime.now().year,
        }
        return self.render('about.html', tparams)


    @cherrypy.expose
    def signup(self, name=None, username=None, email=None, phone_number=None, address=None, zip_code=None, password=None, password2=None):
        if email == None:
            tparams = {
                'title': 'Sign up to City Greens',
                'errors': False,
                'invalid_email': False,
                'user': self.get_user(),
                'year': datetime.now().year,
            }
            return self.render('signup.html', tparams)
        else:
            self.do_registrationFirebase(name, username, email, phone_number, address, zip_code, password)
            raise cherrypy.HTTPRedirect("/login")
        
            
    @cherrypy.expose
    def login(self, email=None, password=None):
        if email == None and self.get_user()['is_authenticated'] == False:
            tparams = {
                'title': 'Login',
                'errors': False,
                'user': self.get_user(),
                'year': datetime.now().year,
            }
            return self.render('login.html', tparams)
        else:
            self.do_authenticationFirebase(email, password)
            if not self.get_user()['is_authenticated']:
                tparams = {
                    'title': 'Login',
                    'errors': True,
                    'user': self.get_user(),
                    'year': datetime.now().year,
                }
                return self.render('login.html', tparams)
            else:
                raise cherrypy.HTTPRedirect("/")

    @cherrypy.expose
    def shop(self):
        tparams = {
                'title': 'Shop',
                'errors': False,
                'user': self.get_user(),
                'year': datetime.now().year,
            }
        return self.render('shop.html', tparams)
    
    @cherrypy.expose
    def checkout(self):
        tparams = {
                'title': 'Shop',
                'errors': False,
                'user': self.get_user(),
                'year': datetime.now().year,
            }
        return self.render('checkout.html', tparams)

    @cherrypy.expose
    def update_cart(self, product, qty):
        flag = False

        data = {
            'name' : product,
            'quantity' : qty
        }

        if not cherrypy.session["user"]["cart"]:
            print("empty")
            cherrypy.session["user"]["cart"].append(data)
        else:
            for item in cherrypy.session["user"]["cart"]:
                if item["name"] == product:
                    print("remove")
                    flag = True
                    cherrypy.session["user"]["cart"].remove(item)
                    break

            if flag == False:
                print("add")
                cherrypy.session["user"]["cart"].append(data)
                
        print(cherrypy.session["user"]["cart"])
        
        

    @cherrypy.expose
    def check_cart(self):
        return json.dumps(cherrypy.session["user"]["cart"])

    @cherrypy.expose
    def get_cart(self):
        result = []
        db = firebase.database()
        keys = list(db.child("products").shallow().get().val())
        
        for key in keys:
            products = db.child("products").child(key).get()
            for item_p in products.each():
                for item_c in cherrypy.session["user"]["cart"]:
                    if item_p.val()["name"] == item_c["name"]:
                        obj = item_p.val()
                        if obj not in result:
                            result.append(obj)

        if not result:
            return "null"
        else:
            return json.dumps(result)

    @cherrypy.expose
    def cart_counter(self):
    	cart = cherrypy.session['user']['cart']
    	return json.dumps(len(cart))

    @cherrypy.expose
    def removefrom_cart(self, product):
    	cart = cherrypy.session['user']['cart']

    	for a in cart:
    		if a["name"] == product:
    			cart.remove(a)
    			return True
    	return False

    @cherrypy.expose
    def update_quantity(self, product, qty):
    	cart = cherrypy.session['user']['cart']

    	for a in cart:
    		if a[0] == product:
    			a[1] == qty
    			return True
    	return False

    @cherrypy.expose
    def user_exists(self, email):

        data = {
            "response" : "False"
        }

        db = firebase.database()
        users = db.child("users").get()

        for user in users.each():
            if user.val()["email"] == email:
                data["response"] = "True"

        return data["response"]

    
    @cherrypy.expose
    def get_products_list(self, category):
        db = firebase.database()
        try:
            if category == None:
                return json.dumps(db.child("products").get().val())
            else:
                return json.dumps(db.child("products").child(category).get().val())
        except:
            return "{}"

    @cherrypy.expose
    def search_products(self, search):
        db = firebase.database()
        result = []

        keys = list(db.child("products").shallow().get().val())
    
        for key in keys:
            products = db.child("products").child(key).get()
            for item in products.each():
                product_names = item.val()["name"].split()
                search_names = search.split()
                for p_name in product_names:
                    for s_name in search_names:
                        if p_name == s_name:
                            obj = db.child("products").child(key).order_by_child("name").equal_to(item.val()["name"]).get().val()
                            if obj not in result:
                                result.append(obj)
        
  
        if not result:
            return "null"
        else:
            return json.dumps(result)      
        
    @cherrypy.expose
    def logout(self):
        self.set_user()
        raise cherrypy.HTTPRedirect("/")

    @cherrypy.expose
    def shut(self):
        cherrypy.engine.exit()

    @cherrypy.expose
    def profile(self):
        tparams = {
                'title': 'profile',
                'errors': False,
                'user': self.get_user(),
                'year': datetime.now().year,
            }
        return self.render('profile.html', tparams)

    @cherrypy.expose
    def check_password(self, old_pwd, new_pwd1, new_pwd2):
        db = firebase.database()
        users = db.child("users").get()

        for user in users.each():
            if user.val()["name"] == cherrypy.session["user"]["username"]:
                if user.val()["password"] != old_pwd:
                    print("0000");
                    return "0"
                else:
                    data = {
                        "password" : new_pwd1
                    }
                    db.child("users").child(user.key()).update(data)
                    
                    return "1"

    @cherrypy.expose
    def change_email(self, email_addr):
        db = firebase.database()
        users = db.child("users").get()

        for user in users.each():
            if user.val()["name"] == cherrypy.session["user"]["username"]:
                db.child("users").child(user.key()).update({"email": email_addr})


    @cherrypy.expose
    def get_user_details(self):
        db = firebase.database()
        users = db.child("users").get()

        for user in users.each():
            if(user.val()["name"] == cherrypy.session["user"]["username"]):
                return json.dumps(user.val())

    @cherrypy.expose
    def profile_update(self, username=None, name=None, email=None, number=None, addr=None, zipcode=None, pwd=None):
        tparams = {
            'title': 'profile',
            'errors': False,
            'user': self.get_user(),
            'year': datetime.now().year,
        }

        db = firebase.database()

        users = db.child("users").get()

        for user in users.each():
            if user.val()["name"] == cherrypy.session["user"]["username"]:
                if name != user.val()["name"] and name != "" and name != None:
                    db.child("users").child(user.key()).update({"username": name})
                if email != user.val()["email"] and email != "" and email != None:
                    db.child("users").child(user.key()).update({"email": email})
                if number != user.val()["phone_number"] and number != "" and number != None:
                    db.child("users").child(user.key()).update({"phone_number":number})
                if addr != user.val()["address"] and addr != "" and addr != None:
                    db.child("users").child(user.key()).update({"address": addr})
                if zipcode != user.val()["zip_code"] and zipcode != "" and zipcode != None:
                    db.child("users").child(user.key()).update({"zip_code": zipcode})

        return self.render('profile.html', tparams)

########################################################################################################################
#   Configuration

if __name__ == '__main__':
    conf = {
        'global': {
            'server.socket_host': '0.0.0.0',
            'server.socket_port': int(os.environ.get('PORT', 5000)),
        },
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/css': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './css'
        },
        '/scripts': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './scripts'
        }
    }

  
    cherrypy.quickstart(WebApp(), '/', conf)
