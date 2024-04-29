""" ================================================================================================
Institucion..: Universidad Tecnica Nacional
Sede.........: Del Pacifico
Carrera......: Tecnologias de Informacion
Periodo......: 3-2021
Charla.......: Uso de Python para crear interface proyecto Web 1
Documento....: api_data_02.py
Objetivos....: Demostracion de un micro servicio web con api-REST.
Profesor.....: Jorge Ruiz (york)
Estudiante...:
================================================================================================"""
# -------------------------------------------------------
# Import libraries API service support
# -------------------------------------------------------
from datetime import datetime
import random
from pymongo import MongoClient
from bson.objectid import ObjectId

conex = MongoClient(host=['127.0.0.1:27017'])
conexDB = conex.apiData_02

from flask import Flask, jsonify, abort, make_response, request
from flask_cors import CORS

# Create flask app
app = Flask(__name__)
CORS(app)

# Make the WSGI interface available at the top level so wfastcgi can get it.
wsgi_app = app.wsgi_app


# -------------------------------------------------------
# Create local API functions
# -------------------------------------------------------
def token():
    ahora = datetime.now()
    antes = datetime.strptime("1970-01-01", "%Y-%m-%d")
    return str(hex(abs((ahora - antes).seconds) * random.randrange(10000000)).split('x')[-1]).upper()

# -------------------------------------------------------
# Error control, httpRequest rules
# -------------------------------------------------------
@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad request....!'}), 400)

@app.errorhandler(401)
def unauthorized(error):
    return make_response(jsonify({'error': 'Unauthorized....!'}), 401)

@app.errorhandler(403)
def forbiden(error):
    return make_response(jsonify({'error': 'Forbidden....!'}), 403)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found....!'}), 404)

@app.errorhandler(500)
def not_found(error):
    return make_response(jsonify({'error': 'Inernal Server Error....!'}), 500)

# -----------------------------------------------------
# Create routes and intereste user control functions
# -----------------------------------------------------

# Interested user signup, register new interested   registra interesado
@app.route('/interested', methods=['POST'])
def create_user():
    if not request.json or \
            not 'name' in request.json or \
            not 'email' in request.json or \
            not 'cellphone' in request.json or \
            not 'passwd' in request.json:
        abort(400)

    user = {
        'name': request.json['name'],
        'email': request.json['email'],
        'cellphone': request.json['cellphone'],
        'passwd': request.json['passwd']
    }
    try:
        result = conexDB.interested.insert_one(user)
        user2 = {
            'token':str(result.inserted_id),
            'name': request.json['name']
        }
        data = {
            "status_code": 201,
            "status_message": "Data was created",
            "data": {'interested': user2}
        }
    except Exception as expc:
        abort(500)
    return jsonify(data), 201


@app.route('/interested/<string:token>', methods=['PUT'])       #actualiza info del interesado
def update_user(token):
    if not request.json or \
            not 'name' in request.json or \
            not 'email' in request.json or \
            not 'cellphone' in request.json:
        abort(400)

    try:
        datos = conexDB.interested.find_one({"_id":ObjectId(token)})
        if datos == None:
            abort(404)

        conexDB.interested.update_one({'_id':ObjectId(token)},
                                     {'$set':{'name':request.json.get('name', datos['name']),
                                              'email':request.json.get('email', datos['email']),
                                              'cellphone':request.json.get('cellphone', datos['cellphone'])}})        

    except Exception as expc:
        abort(404)

    datos2 = {'name':request.json.get('name', datos['name']),
              'email':request.json.get('email', datos['email']),
              'cellphone':request.json.get('cellphone', datos['cellphone'])}

    data = {
        "status_code": 200,
        "status_message": "Ok",
        "data": datos2
    }
    return jsonify(data), 201


# Retrieve data interested from token
@app.route('/<string:token>/me', methods=['GET'])
def get_user(token):
    try:
        user = conexDB.interested.find_one({"_id":ObjectId(token)})

        if user == None:
            abort(404)

        data = {
            "status_code": 200,
            "status_message": "Ok",
            "name" : user['name'],
            "email": user['email'],
            "cellphone": user['cellphone'],
            "data": {'user': {"name": user['name'],
                              "email": user['email'],
                              "cellphone": user['cellphone'],
                              }
                    }
        }
    except Exception as expc:
        abort(404)
    return jsonify(data)


# Retrieve token field from login data
@app.route('/login/<string:email>/<string:passwd>', methods=['GET'])
def get_login(email, passwd):
    try:
        user = conexDB.interested.find_one({"email":{"$eq":email},"passwd":{"$eq":passwd}})
        if user == None:
            abort(404)
        data = {
            "status_code": 200,
            "status_message": "Ok",
            "token" : str(user['_id']),
            "data": {'user': {"name": user['name'],
                              "token": str(user['_id'])
                              }
                    }
        }
    except Exception as expc:
        abort(404)
    return jsonify(data)

# ------------------------------------------------------------------
# Procesos relacionados con el registro de atestados del interesado
# ------------------------------------------------------------------
# Registra los datos de certificaciones del interasado
@app.route('/<string:token>/certification', methods=['POST'])
def create_certification(token):
    if not request.json or \
            not 'description' in request.json or \
            not 'category' in request.json or \
            not 'studycenter' in request.json or \
            not 'year' in request.json:
        abort(400)

    data = {
        'description': request.json['description'],
        'category': request.json['category'],
        'studycenter': request.json['studycenter'],
        'year': request.json['year'],
        'token': token
    }
    try:
        result = conexDB.certification.insert_one(data)
        data2 = {
            'id': str(result.inserted_id),
            'description': request.json['description'],
            'category': request.json['category'],
            'studycenter': request.json['studycenter'],
            'year': request.json['year'],
            'token': token
        }
        salida = {
            "status_code": 201,
            "status_message": "Data was created",
            "data": data2
        }
    except Exception as expc:
        abort(500)
    return jsonify({'customer': salida}), 201


# Recupera la lista de clientes para un usuario
#                                               Basicamente, los estudios que haya registrado el compa
@app.route('/<string:token>/certification', methods=['GET'])
def get_customers(token):
    try:
        datos = conexDB.certification.find({"token":{"$eq":token}})

        if datos == None:
            data = {
                "status_code": 200,
                "status_message": "Ok",
                "data": "Empty certification list"
            }
        else:
            lista = []
            for collect in datos:
                lista.append({"id": str(collect['_id']),
                      "description": collect['description'],
                      "category": collect['category'],
                      "studycenter": collect['studycenter'],
                      "year": collect['year'],
                      "token":collect['token']})

            data = {
                "status_code": 200,
                "status_message": "Ok",
                "data": lista
            }
    except:
        abort(500)
    return jsonify(data)


# Recupera los datos de un cliente para un usuario

#       usuario + /certification + /ID de la certificacion registrada 
@app.route('/<string:token>/certification/<string:cus_id>', methods=['GET'])
def get_customer_id(token, cus_id):
    try:
        datos = conexDB.certification.find_one({"token":token,"_id":ObjectId(cus_id)})

        if datos == None:
            data = {
                "status_code": 404,
                "status_message": "Ok",
                "data": "Certification data not found"
            }
        else:
            data = {
                "status_code": 200,
                "status_message": "Ok",
                "data": {"id": str(datos['_id']),
                        "description": datos['description'],
                        "category": datos['category'],
                        "studycenter": datos['studycenter'],
                        "year": datos['year'],
                        "token":datos['token']}
            }
    except Exception as expc:
        abort(404)
    return jsonify(data)


# Modifica los datos de un cliente para un usuario
#       usuario + /certification + /ID de la certificacion registrada (meter info en Body)
@app.route('/<string:token>/certification/<string:cus_id>', methods=['PUT'])
def update_customer(token, cus_id):
    try:
        datos = conexDB.certification.find_one({"token":token,"_id":ObjectId(cus_id)})
        if datos == None:
            abort(404)
        if not request.json:
            abort(400)
        if 'description' in request.json and request.json['description'] == '':
            abort(400)
        if 'category' in request.json and request.json['category'] == '':
            abort(400)
        if 'studycenter' in request.json and request.json['studycenter'] == '':
            abort(400)
        if 'year' in request.json and request.json['year'] == '':
            abort(400)

        conexDB.certification.update_one({'_id':ObjectId(cus_id)},
                                    {'$set':{'description':request.json.get('description', datos['description']),
                                             'category':request.json.get('category', datos['category']),
                                             'studycenter':request.json.get('studycenter', datos['studycenter']),
                                             'year':request.json.get('year', datos['year'])}})
    except Exception as expc:
        abort(404)

    datos2 = {'description':request.json.get('description', datos['description']),
                'category':request.json.get('category', datos['category']),
                'studycenter':request.json.get('studycenter', datos['studycenter']),
                'year':request.json.get('year', datos['year'])}

    data = {
        "status_code": 200,
        "status_message": "Ok",
        "data": datos2
    }

    return jsonify(data), 200


# Elimna un cliente para un usuario

@app.route('/<string:token>/certification/<string:cus_id>', methods=['DELETE'])
def delete_customer(token, cus_id):
    try:
        datos = conexDB.certification.find_one({"token":token,"_id":ObjectId(cus_id)})
        if datos == None:
            abort(404)
        conexDB.certification.delete_one({'_id':ObjectId(cus_id)})

    except Exception as expc:
        abort(404)
    return jsonify({'result': True})

# registrar una empresa
@app.route('/enterprise', methods=['POST'])
def create_enterprise():
    if not request.json or \
            not 'name' in request.json or \
            not 'url' in request.json or \
            not 'callcenter' in request.json or \
            not 'address' in request.json:
        abort(400)

    security = token()

    enter = {
        'name': request.json['name'],
        'url': request.json['url'],
        'callcenter': request.json['callcenter'],
        'address': request.json['address'],
        'security': security
    }
    try:
        result = conexDB.enterprise.insert_one(enter)
        enter2 = {
            'token':str(result.inserted_id),
            'name': request.json['name'],
            'security':security
        }
        data = {
            "status_code": 201,
            "status_message": "Data was created",
            "data": {'enterprise': enter2}
        }
    except Exception as expc:
        abort(500)
    return jsonify(data), 201

# Actualizar datos de la empresa
@app.route('/enterprise/<string:token>', methods=['PUT'])
def update_enterprise(token):
    if not request.json or \
            not 'name' in request.json or \
            not 'url' in request.json or \
            not 'callcenter' in request.json or \
            not 'address' in request.json or \
            not 'security' in request.json:
        abort(400)

    try:
        datos = conexDB.enterprise.find_one({"security":request.json['security'],"_id":ObjectId(token)})
        if datos == None:
            abort(404)

        conexDB.enterprise.update_one({'_id':datos['_id']},
                                    {'$set':{'name':request.json.get('name', datos['name']),
                                             'url':request.json.get('url', datos['url']),
                                             'callcenter':request.json.get('callcenter', datos['callcenter']),
                                             'address':request.json.get('address', datos['address'])}})

    except Exception as expc:
        abort(404)

    datos2 = {'name':request.json.get('name', datos['name']),
              'url':request.json.get('url', datos['url']),
              'callcenter':request.json.get('callcenter', datos['callcenter']),
              'address':request.json.get('address', datos['address'])}

    data = {
        "status_code": 200,
        "status_message": "Ok",
        "data": datos2
    }

    return jsonify(data), 200



# Recupera los datos de una empresa especifica
@app.route('/enterprise/<string:token>', methods=['GET'])
def get_enterprises(token):
    try:
        datos = conexDB.enterprise.find_one({'_id':ObjectId(token)})

        if datos == None:
            data = {
                "status_code": 404,
                "status_message": "Not Found",
                "data": "Enterprise not found"
            }
            return jsonify(data), 404
        else:
            dts = {
                "name": datos['name'],
                "url": datos['url'],
                "callcenter": datos['callcenter'],
                "address": datos['callcenter'],
                "security":datos['security']
            }
            data = {
                "status_code": 200,
                "status_message": "Ok",
                "data": dts 
            }
    except:
        abort(500)
    return jsonify(data)



#login empresa
@app.route('/login-interprice/<string:name>/<string:security>', methods=['GET'])
def get_enterprise_login(name, security):
    try:
        enterprise = conexDB.enterprise.find_one({"name": name, "security": security})
        if enterprise is None:
            return jsonify({
                "status_code": 404,
                "status_message": "Not Found",
                "data": "Enterprise not found"
            }), 404

        data = {
            "status_code": 200,
            "status_message": "Ok",
            "token": str(enterprise['_id']),
            "data": {
                "enterprise": {
                    "name": enterprise['name'],
                    "security": enterprise['security'],
                    "token": str(enterprise['_id'])
                }
            }
        }
    except Exception as expc:
        abort(500)
    return jsonify(data), 200






# Recupera los datos de todas las empresas
@app.route('/enterprise', methods=['GET'])
def get_allenterprises():
    try:
        datos = conexDB.enterprise.find()

        if datos == None:
            data = {
                "status_code": 404,
                "status_message": "Not Found",
                "data": "The enterprise list is empty"
            }
            return jsonify(data), 404 
        else:
            lista = [0, 1 ,2 ,3 ,4 ,5]
            for collect in datos:
                lista.append({"token": str(collect['_id']),
                      "name": collect['name'],
                      "url": collect['url'],
                      "callcenter": collect['callcenter'],
                      "address": collect['address'],
                      "security": collect['security']})

            data = {
                "status_code": 200,
                "status_message": "Ok",
                "enterprises": lista
            }
    except:
        abort(500)
    return jsonify(data)

# ------------------------------------------------------------
# Procesos relacionados con el control de puestos disponibles
# ------------------------------------------------------------
# Registra los datos de una oferta laboral, asignando una empresa (recordar ponerle el enterprise y security en el api para que funcione)
@app.route('/job', methods=['POST'])
def create_job():
    if not request.json or \
            not 'enterprise' in request.json or \
            not 'security' in request.json or \
            not 'titlejob' in request.json or \
            not 'description' in request.json or \
            not 'hiringtype' in request.json or \
            not 'requirements' in request.json:
        abort(400)

    data = {
        'enterprise': request.json['enterprise'],
        'titlejob': request.json['titlejob'],
        'description': request.json['description'],
        'hiringtype': request.json['hiringtype'],
        'requirements': request.json['requirements']
    }

    try:
        datos = conexDB.enterprise.find_one({"security":request.json['security'],"_id":ObjectId(request.json['enterprise'])})
        if datos == None:
            abort(404)

        result = conexDB.jobs.insert_one(data)
        data2 = {
            'id': str(result.inserted_id),
            'enterprise': request.json['enterprise'],
            'titlejob': request.json['titlejob'],
            'description': request.json['description'],
            'hiringtype': request.json['hiringtype'],
            'requirements': request.json['requirements']
        }
        salida = {
            "status_code": 201,
            "status_message": "Data was created",
            "data": data2
        }
    except Exception as expc:
        abort(500)
    return jsonify({'job': salida}), 201




@app.route('/job', methods=['GET'])
def getting_jobs_info():
    try:
        datos = conexDB.jobs.find()

        datos = list(conexDB.jobs.find())

        if not datos:  # Verificar si la lista está vacía
            data = {
                "status_code": 404,
                "status_message": "Not Found",
                "data": "no jobs found"
            }
            return jsonify(data), 404
        else:
            lista_jobs = []
            for jobs in datos:
                lista_jobs.append(
                    {
                        "job_id" : str(jobs['_id']),
                        "enterprise" : jobs['enterprise'],
                        "titlejob" : jobs['titlejob'],
                        "description" : jobs['description'],
                        "hiringtype" : jobs['hiringtype'],
                        "requirements" : jobs['requirements'],
                    }
                )

            data = {
                "status_code" : 200 ,
                "status_message" : "Ok" ,
                "jobs" : lista_jobs
            }
    except Exception as e:
        print("Error", e)
        abort(500)
    return jsonify(data)

if __name__ == '__main__':
    HOST = '0.0.0.0'
    PORT = 5001
    app.run(HOST, PORT)

