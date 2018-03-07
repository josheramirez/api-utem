API RESTful de la Universidad Tecnológica Metropolitana
======
Busca poner a disposición de los usuarios de una manera unificada, limpia y estructurada la información disponible en la página web oficial de la Dirección de Docencia (a.k.a. [Dirdoc](https://dirdoc.utem.cl/)) de la Universidad Tecnológica Metropolitana de Chile, de tal manera que cualquier desarrollador pueda generar nuevo contenido 

Funcionalidades
------
La API está construida en base a la arquitectura REST, por lo tanto utiliza el protocolo HTTP y sus verbos para funcionar. Todas las respuestas entregadas por la aplicación se generan en formato `JSON`. Si bien se implementa el enfoque *stateless*, las sesiones de usuario y las credenciales son necesarias para mostrar información personal, por lo que se hace uso de tokens de acceso para manipular información sensible y **no revelar ni el RUT ni la contraseña del usuario**.
### Estudiantes
Devuelve la információn básica del estudiante:
```javascript
{
  "nombre": "Jorge Andrés Verdugo Chacón",
  "rut": "19649846-K",
  "email": "mapacheverdugo@utem.cl",
  "carreras": "/estudiantes/19649846/carreras"
}
```
### Carreras
Devuelve todas las carreras, tanto cursadas, como en curso a las que pertenece un determinado estudiante.
```javascript
[{
  "codigo": 21030,
  "nombre": "Ingeniería en Informática",
  "plan": 4,
  "estado": "Titulado",
  "añoIngreso": 2006,
  "semestreIngreso": 1,
  "añoTermino": 2012,
  "semestreTermino": 1,
  "mallaCurricular": "/estudiantes/19649846/carreras/21030/malla"
},
{
  "codigo": 21041,
  "nombre": "Ingeniería Civil En Computación Menc. Informática",
  "plan": 5,
  "estado": "Regular",
  "añoIngreso": 2016,
  "semestreIngreso": 1,
  "añoTermino": null,
  "semestreTermino": null,
  "mallaCurricular": "/estudiantes/19649846/carreras/21041/malla"
}]
```
#### Malla curricular
Devuelve la malla curricular de una determinada carrera
```javascript
{
  "nivelActual": 5,
  "asignaturasTotal": 61,
  "asignaturasAprobadas": 20,
  "asignaturasReprobadas": 0,
  "avanceMalla": 0.33,
  "asignaturas": [{
    "nivel": 1,
    "asignaturas": [{
        "nombre": "Quimica General",
        "tipo": "Obligatorio",
        "vecesCursada": 1,
        "aprobada": true,
        "seccion": null,
        "nota": 5.3
      },
      {
        "nombre": "Taller De Matematica",
        "tipo": "Obligatorio",
        "vecesCursada": 1,
        "aprobada": true,
        "seccion": null,
        "nota": 5
      },
      {
      ... // Más asignaturas
      }
    ]},
    {
    ... // Más niveles
    }
  ]
}
```
### Asignaturas
Devuelve las asignaturas de los dos últimos semestres académicos, hayan sido cursados o no:
```javascript
[{
    "anio": 2017,
    "semestre": "Verano",
    "semestreNumero": null,
    "promedio": null,
    "totalAsignaturas": 0,
    "asignaturas": null
  },
  {
    "anio": 2017,
    "semestre": "Segundo",
    "semestreNumero": 2,
    "promedio": 5.3,
    "totalAsignaturas": 6,
    "asignaturas": [{
        "id": 128033,
        "codigo": "MATC8041",
        "nombre": "Calculo Avanzado",
        "profesor": "Camilo Vera Albornoz",
        "seccion": 103,
        "estado": "Aprobado",
        "notaFinal": 5.8,
        "notas": "/estudiantes/19649846/carreras/21041/asignaturas/128033/notas",
        "bitacora": "/estudiantes/19649846/carreras/21041/asignaturas/128033/bitacora",
        "atencionProfesor": "/estudiantes/19649846/carreras/21041/asignaturas/128033/atencion"
      },
      {
        "id": 128135,
        "codigo": "INFB8040",
        "nombre": "Lenguajes De Programacion",
        "profesor": "Hector Pincheira Conejeros",
        "seccion": 411,
        "estado": "Aprobado",
        "notaFinal": 4.3,
        "notas": "/estudiantes/19649846/carreras/21041/asignaturas/128135/notas",
        "bitacora": "/estudiantes/19649846/carreras/21041/asignaturas/128135/bitacora",
        "atencionProfesor": "/estudiantes/19649846/carreras/21041/asignaturas/128135/atencion"
      },
      {
        ... // Más asignaturas
    }]
}]
```
#### Notas
Devuelve las notas registradas en una determinada asignatura.
```javascript
{
  "presentacion": 3.9,
  "rindeExamen": true,
  "examen": 5,
  "final": 4.3,
  "aprobado": true,
  "notas": [{
      "tipo": "Parcial",
      "ponderacion": 0.15,
      "valor": 4.7
    },
    {
      "tipo": "Parcial",
      "ponderacion": 0.35,
      "valor": 3.7
    },
    {
      "tipo": "Parcial",
      "ponderacion": 0.15,
      "valor": 5.6
    },
    {
      "tipo": "Acumulativa",
      "ponderacion": 0.35,
      "valor": 3.1
  }]
}
```
#### Bitácora y asistencia
Devuelve la bitácora de clases, con la asistencia de una determinada asignatura:
```javascript
{
  "clasesRegistradas": 43,
  "clasesAsistidas": 33,
  "porcentajeAsistencia": 0.77,
  "registros": [{
      "dia": "21-08-2017",
      "periodo": 2,
      "horaInicio": "09:40",
      "horaTermino": "11:10",
      "asistencia": true,
      "bitacora": "Evolución y clasificación de los lenguajes",
      "observacion": null
    },
    {
      "dia": "21-08-2017",
      "periodo": 1,
      "horaInicio": "08:00",
      "horaTermino": "09:30",
      "asistencia": true,
      "bitacora": "Presentación del curso, programa, evaluaciones, bibliografía",
      "observacion": null
    },
    {
      "dia": "23-08-2017",
      "periodo": 1,
      "horaInicio": "08:00",
      "horaTermino": "09:30",
      "asistencia": false,
      "bitacora": "Paradigmas de programación",
      "observacion": null
    },
    {
    ... // Más registros
  }]
}
```
Aviso legal
------
Este es un proyecto **no oficial** y está protegido bajo la [licencia MPL 2.0](https://github.com/mapacheverdugo/api-dirdoc-utem/blob/master/LICENSE) y por ningún motivo pretende suplantar ni reemplazar la información entregada por el portal https://dirdoc.utem.cl/ ni ninguna de las plataformas de la universidad, las cuales deben ser consideras como los únicos medios oficiales de interacción. El creador y los colaboradores de este repositorio **no se hacen resposables** de los problemas que pueda generar directamente o indirectamente el uso correcto o indebido de esta aplicación.

Contribuciones
------
De momento no hay ningun aporte externo en este repositorio, pero con gusto aceptamos nuevos colaboradores al proyecto, mediante `pull request` o *forks*, por lo que la invitación queda abierta para cualquiera.


