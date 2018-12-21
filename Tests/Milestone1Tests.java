package com.example.tests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class Milestone1Tests {
  private WebDriver driver;
  private String baseUrl;
  private boolean acceptNextAlert = true;
  private StringBuffer verificationErrors = new StringBuffer();

  @Before
  public void setUp() throws Exception {
    driver = new FirefoxDriver();
    baseUrl = "https://www.katalon.com/";
    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
  }

  @Test
  public void testMilestone1Tests() throws Exception {
    driver.get("http://citygreens.herokuapp.com/");
    driver.findElement(By.xpath("(//button[@type='button'])[4]")).click();
    try {
      assertEquals("0", driver.findElement(By.id("cart_size")).getText());
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Remove'])[1]/following::label[1]")).click();
    try {
      assertEquals("1", driver.findElement(By.id("cart_size")).getText());
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.xpath("(//button[@type='button'])[5]")).click();
    try {
      assertEquals("Shopping Cart", driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Start shopping now!'])[1]/preceding::h2[1]")).getText());
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    try {
      assertEquals("1", driver.findElement(By.id("Banana")).getAttribute("value"));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.id("Banana")).clear();
    driver.findElement(By.id("Banana")).sendKeys("2");
    driver.findElement(By.id("Banana")).click();
    driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Quantity:'])[1]/following::i[1]")).click();
    try {
      assertEquals("0", driver.findElement(By.id("cart_size")).getText());
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
  }

  @After
  public void tearDown() throws Exception {
    driver.quit();
    String verificationErrorString = verificationErrors.toString();
    if (!"".equals(verificationErrorString)) {
      fail(verificationErrorString);
    }
  }

  private boolean isElementPresent(By by) {
    try {
      driver.findElement(by);
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }

  private boolean isAlertPresent() {
    try {
      driver.switchTo().alert();
      return true;
    } catch (NoAlertPresentException e) {
      return false;
    }
  }

  private String closeAlertAndGetItsText() {
    try {
      Alert alert = driver.switchTo().alert();
      String alertText = alert.getText();
      if (acceptNextAlert) {
        alert.accept();
      } else {
        alert.dismiss();
      }
      return alertText;
    } finally {
      acceptNextAlert = true;
    }
  }
}
