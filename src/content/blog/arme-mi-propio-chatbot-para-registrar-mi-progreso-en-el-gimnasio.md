---
title: Arme mi propio chatbot para registrar mi progreso en el gimnasio
date: 2026-09-24
banner: /images/Chatbot Blog Banner.jpeg
description: Despues de probar varias alternativas para guardar registro de mis
  sesiones de gimnasio ninguna me gustaba o requerian suscripciónes que daban
  funcionalidades que no necesitaba. Asi que decidi hacer algo que me funcionara
  a mi.
---
Hace ya un tiempo que volvi a retomar ir al gimnasio y siempre tuve el problema de que buscaba las apps gratuitas para manejar el registro de mis sesiones de gimansio, si bien en ese momento me servia por que no iba a dedicar tiempo a crear una app para hacerlo. Recientemente empece a buscar otras opciones y me quede con la mas simple: un chatbot al que le enviaba el registro de mis sesiones y el se encargaba de guardarlo en u. excel. Simple y no requeria mucho diseño. Te explico como lo logre:

# # Digital Ocean + N8N + Telegram + Google + Claude unidos

N8N es una herramienta de automatización muy poderosa para tareas repetitivas, no necesita mucha programación para echar a andar una automatización, mi unico problema era la suscripión ya que por el momento no queria pagar 20 dolares que cuesta. Luego de investigar un poco me quede con una solución si bien algo mas rebuscada me ha estado funcionando bastante. Tener mi propio servicio en la nube de N8N corriendo en una VPS.

Para el hosting use un [Droplet](https://try.digitalocean.com/products/droplets/?vector_id=22796527164&vector_source=GOOGLE&vector_campaign=search_brand_compute_droplets_global_en_2&gad_campaignid=22796527164&gbraid=0AAAAADw9jcslG0q0xpHsHkJMcRcd2Z_Pv) de Digital Ocean  me permitio correr una instancia de docker que contenia toda la configuración de N8N, ingresando a una terminal hice las configuraciones necesarias y ya solo fue usar el (Bot Father)[[https://core.telegram.org/bots/tutorial]](https://core.telegram.org/bots/tutorial]) de telegram. Pasarle la api key y conectarlo a mi automatización de N8N y este fue el resultado:



&nbsp;

&nbsp;

&nbsp;

&nbsp;