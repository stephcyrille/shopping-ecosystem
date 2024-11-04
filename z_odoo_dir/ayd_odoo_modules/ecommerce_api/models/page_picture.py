#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : page_picture.py
# description       : Ecommerce page picture object 
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20241104
# version           : 0.1
# notes             : This is the page picture object
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

from odoo import api, fields, models, _


class PagePicture(models.Model):
    _name = 'website.page.picture'
    _description = 'Ecommerce page picture'
    _rec_name = 'id'

    page = fields.Selection([
        ('home', 'Home Page'),
        ('product', 'Product Page'),
        ('category', 'Category Page'),
        ('about', 'About Page'),
        ('contact', 'Contact Page'),
        ('other', 'Custom Page')])
    url = fields.Char(string='URL label')
    picture = fields.Image("Image")
