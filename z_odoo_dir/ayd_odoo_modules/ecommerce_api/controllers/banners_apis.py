#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : banners_apis.py
# description       : Website Banner API controller
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20240910
# version           : 0.1
# notes             : This is the website banner API controller
# license           : MIT
# py version        : 3.9.6
# ==============================================================================
import json
from odoo import http
from ..utils.image_lib import get_image_url


class EcommerceBannerAPI(http.Controller):
    @http.route(['/apis/banners/home'], type='http', auth='public', methods=["GET"], website=True)
    def get_banner_home(self, **params):
        banner_home = http.request.env['website.site.banner'].sudo().search([('page', '=', 'home')], limit=1)
        base_url = http.request.env['ir.config_parameter'].sudo().get_param('web.base.url')
        
        if banner_home is not None:
            curr_banner = {
                'id': banner_home.id,
                'name': banner_home.name,
                'description': banner_home.description,
                'picture': f"{base_url}{get_image_url(banner_home, 'picture')}",
                'page': banner_home.page
            }
        else:
            curr_banner = {}

        res = {
            "result": curr_banner
        }
        return http.Response(
            json.dumps(res),
            status=200,
            mimetype='application/json'
        )
    
    @http.route(['/apis/banners/shop'], type='http', auth='public', methods=["GET"], website=True)
    def get_banner_shoplist(self, **params):
        banner_shop = http.request.env['website.site.banner'].sudo().search([('page', '=', 'product')])
        base_url = http.request.env['ir.config_parameter'].sudo().get_param('web.base.url')
        
        if banner_shop is not None:
            curr_banner = {
                'id': banner_shop.id,
                'name': banner_shop.name,
                'description': banner_shop.description,
                'picture': f"{base_url}{get_image_url(banner_shop, 'picture')}",
                'page': banner_shop.page
            }
        else:
            curr_banner = {}

        res = {
            "result": curr_banner
        }
        return http.Response(
            json.dumps(res),
            status=200,
            mimetype='application/json'
        )
    
    @http.route(['/apis/banners/about'], type='http', auth='public', methods=["GET"], website=True)
    def get_banner_about(self, **params):
        banner_about = http.request.env['website.site.banner'].sudo().search([('page', '=', 'about')])
        about_pic = http.request.env['website.page.picture'].sudo().search([('page', '=', 'about')], limit=1)
        base_url = http.request.env['ir.config_parameter'].sudo().get_param('web.base.url')
        
        curr_banner = {}
        curr_about_pic = {}

        if banner_about is not None:
            curr_banner = {
                'id': banner_about.id,
                'name': banner_about.name,
                'description': banner_about.description,
                'picture': f"{base_url}{get_image_url(banner_about, 'picture')}",
                'page': banner_about.page
            }

        if about_pic is not None:
            curr_about_pic = {
                'id': about_pic.id,
                'picture': f"{base_url}{get_image_url(about_pic, 'picture')}",
                'url': about_pic.url
            }

        res = {
            "result": {
                'banner': curr_banner,
                'body': curr_about_pic
            }
        }
        return http.Response(
            json.dumps(res),
            status=200,
            mimetype='application/json'
        )
