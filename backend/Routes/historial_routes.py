from flask import Blueprint, jsonify
from Models.historial import HistorialDiagnostico
from Models.mascota import Mascota
from database import db
from utils import token_required

historial_bp = Blueprint('historial', __name__)

@historial_bp.route('/', methods=['GET'])
@token_required
def obtener_historial(usuario_actual):
    historiales = (
        HistorialDiagnostico.query
        .filter_by(usuario_id=usuario_actual.id)
        .order_by(HistorialDiagnostico.fecha.desc())
        .all()
    )
    
    data = []
    for h in historiales:
        data.append({
            "historial_id": h.id,
            "enfermedad": h.enfermedad,
            "prioridad": h.prioridad,
            "fecha": h.fecha.isoformat(),
            "mascota": {
                "id": h.mascota.id,
                "nombre": h.mascota_nombre,
                "imagen_url": h.mascota.imagen_url
            }
        })
    
    return jsonify(data), 200    

@historial_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def eliminar_historial(current_user, id):
    historial = HistorialDiagnostico.query.filter_by(id=id, usuario_id=current_user.id).first()
    
    if not historial:
        return jsonify({"mensaje": "Historial no encontrado"}), 404
    
    db.session.delete(historial)
    db.session.commit()
    
    return jsonify({"mensaje": "Historial eliminado"}), 200

@historial_bp.route('/<int:id>', methods=['GET'])
@token_required
def obtener_diagnostico_por_id(usuario_actual, id):
    historial = (
        HistorialDiagnostico.query
        .filter_by(id=id, usuario_id=usuario_actual.id)
        .first()
    )
    
    if not historial:
        return jsonify({"mensaje": "Diagnostico no encontrado"}), 404
    
    return jsonify({
        "historial_id": historial.id,
        "fecha": historial.fecha.isoformat(),
        "enfermedad": historial.enfermedad,
        "prioridad": historial.prioridad,
        "recomendacion": historial.recomendacion,
        "mascota": {
            "id": historial.mascota.id,
            "nombre": historial.mascota.nombre,
            "imagen_url": historial.mascota.imagen_url
        }
    }), 200
    