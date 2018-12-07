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
            cherrypy.session['user'] = {'is_authenticated': False, 'username': ''}
        else:
            cherrypy.session['user'] = {'is_authenticated': True, 'username': username}


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
                self.set_user(usr)

    def do_registrationFirebase(self, name, email, number, addr, zipcode, pwd):
        db = firebase.database()
        users = db.child("users").get()

        data = {
            "name": name,
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
    def signup(self, name=None, email=None, phone_number=None, address=None, zip_code=None, password=None, password2=None):
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
            self.do_registrationFirebase(name, email, phone_number, address, zip_code, password)
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
    def search_products(self, category, search):
        db = firebase.database()
        result = []

        products = db.child("products").child(category).get()

        for item in products.each():
            words = item.val()["name"].split()
            for word in words:
                if word == search:
                    result.append(item.val())

        return json.dumps(result)      
        
    @cherrypy.expose
    def logout(self):
        self.set_user()
        raise cherrypy.HTTPRedirect("/")

    @cherrypy.expose
    def shut(self):
        cherrypy.engine.exit()


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
