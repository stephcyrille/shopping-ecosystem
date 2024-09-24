{
    'name': "Ecommerce REST API",

    'summary': 'Ecommerce RESTFul API ',

    'sequence': 11,

    'description': """
Ecommerce REST API module
====================
Ecommerce REST API module: contains multiple routes 
    - Product list | detail
    - Public category list
    - Sale Order List and detail (Cart)
""",

    'author': "Stephane Cyrille Mebenga",
    'website': "https://stephanemebenga.site",

    'category': 'Website/API',
    'version': '16.1.0',

    # any module necessary for this one to work correctly
    'depends': ['sale_management', 'web', 'website', 'stock', 'website_sale'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        
        "views/product_template.xml",
        "views/website_site_banner.xml",
        "views/website_home_collection.xml",
        "views/website_size.xml",
        "views/product_template_size.xml",
    ],
    'assets': {
         # 'web.assets_frontend': [
         #     "https://kit.fontawesome.com/b2b52c5522.js",
         #     "/ecommerce_api/static/src/js/index.js",
         # ]
    },
    'installable': True,
    'application': False
}
# -*- coding: utf-8 -*-
