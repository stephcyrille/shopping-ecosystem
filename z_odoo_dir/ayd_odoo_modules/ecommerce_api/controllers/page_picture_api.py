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
import logging

_logger = logging.getLogger(__name__)


class EcommercePagePictureAPI(http.Controller):
    @http.route(['/apis/home/instagram'], type='http', auth='public', methods=["GET"], website=True)
    def get_picture_instagram(self, **params):
        pictures_home = http.request.env['website.page.picture'].sudo().search([('page', '=', 'home')])
        base_url = http.request.env['ir.config_parameter'].get_param('web.base.url')
        pic_list = []
        
        if pictures_home is not None:
            for pic in pictures_home:
                curr_pic = {
                    'id': pic.id,
                    'url': pic.url,
                    'picture': f"{base_url}{get_image_url(pic, 'picture')}"
                }
                pic_list.append(curr_pic)

        res = {
            "result": pic_list
        }
        return http.Response(
            json.dumps(res),
            status=200,
            mimetype='application/json'
        )
    