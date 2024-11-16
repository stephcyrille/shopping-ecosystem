#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : cart_apis.py
# description       : Address API controller
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20241116
# version           : 0.1
# notes             : This is a adress API controller
# license           : MIT
# py version        : 3.9.6
# ==============================================================================
import hashlib
import json
import logging
from odoo import http


class EcommerceProfilessAPI(http.Controller):    
    @http.route(['/apis/address/all'], type='http', auth='public', methods=["GET"], website=True)
    def get_customer_address(self, **kwargs):
        if kwargs.get('user'):
            address = http.request.env['res.partner'].sudo().search([('email', '=', kwargs.get('user'))], limit=1)
            if address.child_ids:
                values = {
                    'result': [
                        {
                            'id': o.id,
                            'partner_name': address.name,
                            'name': o.name,
                            'type': o.type,
                            'street': o.street,
                            'street2': o.street2,
                            'city': o.city,
                            'region': o.state_id.code if o.state_id else '',
                            'zip': o.zip,
                            'country': o.country_id.name if o.country_id else '',
                            'phone': o.phone,
                            'mobile': o.mobile,
                            'email': address.email,
                        } for o in address.child_ids]
                }
            else:
                values = {
                    'result': [
                        {
                            'id': address.id,
                            'name': address.name,
                            'partner_name': address.name,
                            'type': 'both',
                            'street': address.street,
                            'street2': address.street2,
                            'city': address.city,
                            'region': address.state_id.code if address.state_id else '',
                            'zip': address.zip,
                            'country': address.country_id.name if address.country_id else '',
                            'phone': address.phone,
                            'mobile': address.mobile,
                            'email': address.email,
                        }
                    ]
                }
        else:
            values = {}
        res = values

        return http.Response(
            json.dumps(res, default=str),
            status=200,
            mimetype='application/json'
        )
    
    @http.route(['/apis/profile/get'], type='http', auth='public', methods=["GET"], website=True)
    def get_customer_profile(self, **kwargs):
        if kwargs.get('user'):
            address = http.request.env['res.partner'].sudo().search([('email', '=', kwargs.get('user'))], limit=1)
            if address:
                values = {
                    'result': {
                        'id': address.id,
                        'name': address.name,
                        'firstname': address.firstname,
                        'lastname': address.lastname,
                        'partner_name': address.name,
                        'email': address.email,
                    }
                }
            else:
                values = {}
        else:
            values = {}
        res = values

        return http.Response(
            json.dumps(res, default=str),
            status=200,
            mimetype='application/json'
        )
    
    @http.route(['/apis/profile/update'], type='json', auth="user", methods=['POST'], website=True, csrf=False)
    def update_user_name(self, **kwargs):
        json_data = json.loads(http.request.httprequest.data)

        firstname = json_data.get('firstname') if json_data.get('firstname') else None
        lastname = json_data.get('lastname') if json_data.get('lastname') else None
        id = int(json_data.get('id')) if json_data.get('id') else None

        profile = http.request.env['res.partner'].sudo().search([('id', '=', id)], limit=1)

        if profile:
            for rec in profile:
                rec.write({
                    'firstname': firstname,
                    'lastname': lastname,
                    'name': f"{lastname} {firstname}",
                })
            values = {
                'id': profile.id,
                'name': profile.name,
                'firstname': profile.firstname,
                'lastname': profile.lastname,
                'partner_name': profile.name,
                'email': profile.email,
            }
            res = {
                "code": 201,
                "data": values,
            }
            return res
        else:
            res = {
                "code": 404,
                "errorMessage": f"Update profile server side error",
                "message": f"Res partner profile {id} not found"
            }
            return res

