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
    'depends': ['sale_management', 'web', 'website', 'stock', 'website_sale', 'contacts'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        
        "views/product_template.xml",
        "views/website_site_banner.xml",
        "views/website_home_collection.xml",
        "views/website_size.xml",
        "views/product_template_size.xml",
        "views/website_page_picture.xml",
        "views/sale_order_line_website.xml",
        "views/res_partner_views.xml",
    ],
    'assets': {},
    'installable': True,
    'application': False
}

