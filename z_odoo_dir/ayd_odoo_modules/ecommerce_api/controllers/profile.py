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
            if address.id == False:
                values = {}
                res = values

                return http.Response(
                    json.dumps(res, default=str),
                    status=200,
                    mimetype='application/json'
                )
            if address.child_ids:
                values = {
                    'result': [
                        {
                            'id': o.id,
                            'partner_name': address.name,
                            'name': o.name,
                            'firstname': o.firstname,
                            'lastname': o.lastname,
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
                            'firstname': address.firstname,
                            'lastname': address.lastname,
                            'partner_name': address.name,
                            'type': address.type,
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
        email = json_data.get('email') if json_data.get('email') else None
        id = int(json_data.get('id')) if json_data.get('id') else None

        if id is None and email:
            profile = http.request.env['res.partner'].sudo().search([('email', '=', email)], limit=1)
            if not profile:
                profile = http.request.env['res.partner'].sudo().create({
                    'firstname': firstname,
                    'lastname': lastname,
                    'type': 'delivery',
                    'name': f"{lastname} {firstname}",
                    'email': email,
                })
            else:
                for rec in profile:
                    rec.write({
                        'firstname': firstname,
                        'lastname': lastname,
                        'type': 'delivery',
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
    
    @http.route(['/apis/address/update'], type='json', auth="user", methods=['POST'], website=True, csrf=False)
    def update_user_address(self, **kwargs):
        json_data = json.loads(http.request.httprequest.data)

        state = json_data.get('state') if json_data.get('state') else None
        city = json_data.get('city') if json_data.get('city') else None
        street = json_data.get('street') if json_data.get('street') else None
        phone = json_data.get('phone') if json_data.get('phone') else None
        adressType = json_data.get('adressType') if json_data.get('adressType') else None
        name = json_data.get('name') if json_data.get('name') else None
        email = json_data.get('email') if json_data.get('email') else None
        add = json_data.get('add') if json_data.get('add') else None
        id = int(json_data.get('id')) if json_data.get('id') else None

        profile = http.request.env['res.partner'].sudo().search([('id', '=', id)], limit=1)
        country_id = http.request.env['res.country'].sudo().search([('code', '=', 'CM')], limit=1)

        if not country_id:
            res = {
                "code": 404,
                "errorMessage": f"Update profile server side error",
                "message": f"Res country with code CM is not found"
            }
            return res
        
        state_id = http.request.env['res.country.state'].sudo().search([('code', '=', state), 
                                                                        ('country_id', '=', country_id.id)], limit=1)
        if not state_id:
            state_id = http.request.env['res.country.state'].sudo().create({
                'name': state,
                'code': state,
                'country_id': country_id.id,
            })


        if profile:
            if "update" == add:
                update_values = {
                    'mobile': phone,
                    'phone': phone,
                    'street': street,
                    'city': city,
                    'country_id': country_id.id,
                    'state_id': state_id.id,
                }
                if adressType != "both":
                    update_values['type'] = adressType
                    update_values['name'] = name

                for rec in profile:
                    rec.write(update_values)
            else:
                child_data_list = [
                    {
                        'type': profile.type,
                        'mobile': profile.phone,
                        'phone': profile.phone,
                        'street': profile.street,
                        'city': profile.city,
                        'country_id': profile.country_id.id,
                        'state_id': profile.state_id.id,
                    },
                    {
                        'type': adressType,
                        'mobile': phone,
                        'phone': phone,
                        'street': street,
                        'city': city,
                        'country_id': country_id.id,
                        'state_id': state_id.id,
                    }
                ]
                child_commands = [(0, 0, child_data) for child_data in child_data_list]
            
                # Update the partner's child_ids
                profile.write({
                    'child_ids': child_commands,
                })

            address = http.request.env['res.partner'].sudo().search([('email', '=', email)], limit=1)
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
                            'type': address.type,
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
            res = {
                "code": 201,
                "data": values,
            }
            return res
        
        elif not profile and "new" == add:
            address = http.request.env['res.partner'].sudo().search([('email', '=', email)], limit=1)
            update_values = {
                'mobile': phone,
                'phone': phone,
                'street': street,
                'city': city,
                'country_id': country_id.id,
                'state_id': state_id.id,
            }
            if adressType != "both":
                update_values['type'] = adressType
                update_values['name'] = name

            for rec in address:
                rec.write(update_values)


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
                            'type': address.type,
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

