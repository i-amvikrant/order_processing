from django.contrib import admin
from .models import parts, vendor, modules, part_list, sub_module_list, customer, orders, product_list

# Register your models here.
admin.site.register(vendor)
admin.site.register(parts)
admin.site.register(modules)
admin.site.register(part_list)
admin.site.register(sub_module_list)
admin.site.register(customer)
admin.site.register(orders)
admin.site.register(product_list)
