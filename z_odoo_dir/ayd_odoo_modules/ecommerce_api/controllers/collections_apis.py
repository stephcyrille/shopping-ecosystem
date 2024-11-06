#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : banners_apis.py
# description       : Website Collections home API controller
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20240911
# version           : 0.1
# notes             : This is the website home collections API controller
# license           : MIT
# py version        : 3.9.6
# ==============================================================================
import json
import logging
from odoo import http
from ..utils.serializer import deserialize_product
from ..utils.image_lib import get_image_url

_logger = logging.getLogger(__name__)


class EcommerceHomeCollectionAPI(http.Controller):
    @http.route(['/apis/home/collections'], type='http', auth='public', methods=["GET"], website=True)
    def get_products_list(self, **params):
        collections_list = http.request.env['website.home.collection'].sudo().search([])
        base_url = http.request.env['ir.config_parameter'].sudo().get_param('web.base.url')

        collections = []
        for collection in collections_list:
            curr_collection = {
                'id': collection.id,
                'title': collection.title,
                'label': collection.label,
                'picture': f"{base_url}{get_image_url(collection, 'picture')}",
                'url_label': collection.url_label,
                'link': collection.link
            }

            collections.append(curr_collection)

        curr_page = 1
        total_pages = 1
        page_size = len(collections)
        res = {
            "count": page_size,
            "current": curr_page,
            "total_pages": total_pages,
            "result": collections
        }
        return http.Response(
            json.dumps(res),
            status=200,
            mimetype='application/json'
        )
