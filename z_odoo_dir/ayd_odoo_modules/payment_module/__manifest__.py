# -*- coding: utf-8 -*-
{
    'name': "Payment Custom Carrier",

    'summary': 'Odoo custom carrier payment moduel',

    'sequence': 13,

    'description': """
Custom paiement modules OM / MTN MOMO / BANK CARD / PAYPAL
====================
""",

    'author': "Stephane Cyrille Mebenga",
    'website': "https://stephanemebenga.site",

    'category': 'Website/API',
    'version': '16.1.0',

    # any module necessary for this one to work correctly
    'depends': ['web', 'website', 'website_sale'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/payment_transaction_views.xml',
        'views/payment_transaction_actions.xml',
        'views/payment_transaction_menus.xml',
    ],
    'installable': True,
    'application': False
}
