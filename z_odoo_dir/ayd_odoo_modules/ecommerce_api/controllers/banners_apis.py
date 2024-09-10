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
import logging
from odoo import http
from ..utils.serializer import deserialize_product
from ..utils.image_lib import get_image_url

_logger = logging.getLogger(__name__)


class EcommerceBannerAPI(http.Controller):
    @http.route(['/apis/banners/all'], type='http', auth='public', methods=["GET"], website=True)
    def get_products_list(self, **params):
        banners_list = http.request.env['website.site.banner'].sudo().search([])
        base_url = http.request.env['ir.config_parameter'].get_param('web.base.url')

        banners = []
        for banner in banners_list:
            curr_banner = {
                'id': banner.id,
                'name': banner.name,
                'description': banner.description,
                'picture': f"{base_url}{get_image_url(banner, 'picture')}",
                'page': banner.page
            }

            banners.append(curr_banner)

        curr_page = 1
        total_pages = len(banners)
        page_size = len(banners)
        res = {
            "count": page_size,
            "current": curr_page,
            "total_pages": total_pages,
            "result": banners
        }
        return http.Response(
            json.dumps(res),
            status=200,
            mimetype='application/json'
        )
