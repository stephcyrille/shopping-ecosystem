#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : login_api.py
# description       : auth API controller
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20240808
# version           : 0.1
# notes             : This auth API controller
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

import json
import logging
from odoo import http

_logger = logging.getLogger(__name__)


class AuthController(http.Controller):
    @http.route(['/apis/auth/login'], type='json', auth='none', website=True, methods=['POST'], csrf=False)
    def api_login(self, **post):
        db = http.request.env.cr.dbname
        username = post.get('username') if post.get('username') else None
        password = post.get('password') if post.get('password') else None
        print("\n\n")
        print(http.request.env.cr.dbname)
        print(http.request.httprequest.headers.get('X-Odoo-Db', None))
        print(post)
        print("\n\n")
        if db is not None and username is not None and password is not None:
            uid = http.request.session.authenticate(db, username, password)

            if uid:
                # Return the user id and session ID
                res = {
                    'uid': uid,
                    'session_id': http.request.session.sid,
                    'message': 'Login successful'
                }
                return res
        res = {
            'error': 'Missing login or password',
            'message': 'You must provide both login and password to authenticate.'
        }
        return res

