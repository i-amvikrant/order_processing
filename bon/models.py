from django.db import models
from phone_field import PhoneField

# Create your models here.
class parts(models.Model):

    PartID = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=50)
    description = models.TextField()
    vendorID = models.ForeignKey('vendor', on_delete=models.CASCADE)
    partType = models.CharField(max_length=10)
    weight = models.FloatField('Weight(in grams)')
    height = models.FloatField('Height(in cm)')
    width = models.FloatField('Width(in cm')
    length = models.FloatField('Length(in cm')
    cost = models.IntegerField('Cost(in rupees')

    def __str__(self):
        return self.PartID


class vendor(models.Model):

    vendorID = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=20)
    poc = models.CharField('Point of contact(name)',max_length=20)
    contact = PhoneField(blank=True, help_text='Contact phone number')
    city = models.CharField(max_length=20)
    Address = models.TextField()
    pincode = models.CharField(max_length=6)

    def __str__(self):
        return self.name


class modules(models.Model):

    designID = models.CharField(max_length=10, primary_key=True, default='000')
    name = models.CharField(max_length=20, default='aaaa')
    Type = models.CharField(max_length=10, default='aaaa')
    made = models.DateField(auto_now=True)
    inventory = models.IntegerField(default=111)

    def __str__(self):
        return self.name


class part_list(models.Model):

    designID = models.ForeignKey('modules', on_delete=models.CASCADE)
    PartID = models.ForeignKey('parts',on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return "DesignID :{}, PartID :{}".format(self.designID,self.PartID)


class sub_module_list(models.Model):

    designID = models.ForeignKey('modules', on_delete = models.CASCADE, related_name = 'Module')
    subID = models.ForeignKey('modules', on_delete=models.CASCADE, related_name = 'Sub_Module')
    quantity = models.IntegerField()

    def __str__(self):
        return "Product :{}, Sub_module :{}".format(self.designID, self.subID)


class customer(models.Model):

    CustomerID = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=20)
    City = models.CharField(max_length=15)
    Address = models.TextField()
    pin = models.CharField(max_length=6)
    poc = models.CharField('point of contact(name)', max_length=20)
    contact = PhoneField(help_text = "phone number of the company or poc")

    def __str__(self):
        return self.name+", "+self.City


class orders(models.Model):

    orderID = models.CharField(max_length=30, primary_key=True)
    placed = models.DateTimeField(auto_now=True)
    customerID = models.ForeignKey('customer', on_delete=models.CASCADE)
    due =  models.IntegerField()

    def __str__(self):
        return self.orderID

class product_list(models.Model):

    productID = models.ForeignKey('modules', on_delete=models.CASCADE)
    orderID = models.ForeignKey('orders', on_delete=models.CASCADE)
    quantity = models.IntegerField()



    