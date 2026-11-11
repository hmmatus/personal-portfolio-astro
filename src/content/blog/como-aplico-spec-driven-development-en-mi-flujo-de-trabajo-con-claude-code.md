---
title: Como aplico Spec Driven Development en mi flujo de trabajo con claude code
date: 2026-11-10
banner: /images/Telegram Photo.jpg
description: Como uso Spec Driven Development aplicado al trabajo para agilizar
  el proceso de desarrollo, desde 0 usando claude code.
---
Recientemente me incorpore a un proyecto que constaba de varias paginas web que consumen de un mismo servidor sus consultas. El proyecto ya se habia refactorizado hace un par de años previo a la implementación de IA asi que se consideraba un codigo legacy, entre las malas practicas mas comunes que encontre:

- No habia un solo cliente que tuviera configuraciones para hacer las consultas, incluso habian bloques de codigo iguales copiados en multiples paginas/componentes
- Practicamente habia menos del 10% de cobertura en el codigo
- Multiple acoplamiento entre varios componentes
- Las ramas de desarrollo y producción tenian demasiadas diferencias asi que era dificil cuando se tocaba un archivo y no era el mismo que tenia producción

Estábamos en un proceso de reestructuración, entonces le querían dar una mejora visual a la página web y también entregar nuevas funcionalidades en un corto tiempo. Mientras yo desarrollaba, notaba muchas de esas cosas y pensaba en cómo poder entregar valor en ese periodo de tiempo corto, pero delegando muchas de las tareas a herramientas de inteligencia artificial. Entonces, me encontré con el concepto del spec-driven development, que consiste en basado en ciertos lineamientos los agentes generan documentación, implementan codigo, ejecutan test y revisan el resultado basandose en criterios de aceptación.

Y esto genera un ciclo en el que tú llevas una especificación y la inteligencia artificial, mediante un agente orquestador, despliega cierto tipo de agentes para cierto tipo de tareas. Esta práctica es comúnmente usada para features bastante grandes. En mi caso, tuve que trabajar el refactor de una página de carrito, y esa página de carrito contenía múltiples llamadas a varios endpoints. También se tuvo que crear nuevos endpoints para unas funcionalidades extra luego de la refactorización.Estábamos en un proceso de reestructuración.

En mi flujo de trabajo actual utilizo claude code,  y lo ejecuto de la siguiente manera:

![](/images/spec-driven-development.jpg)

- Leader: El orquestador, el solo decide en que parte del proceso estamos, si es una tarea sencilla manda al implementer directamente, si ya requiere SDD empieza llamando a spec author
- spec-author: Basado en ciertos requerimientos minimos escribe un archivo de spec, task and impl que incluyen los pasos para resolver la tarea(Agregar nuevos endpoints, diseñar componentes, etc.)
- Implementer: Este se encarga de escribir todo el codigo, ya que para este momento solo escribe en los archivos que ya le especifico spec-author uso el modelo mas economico. sigue las convenciones escritas en el [AGENTS.md](http://AGENTS.md), las skills y documentación que guardo dentro del proyecto como contexto.
- Reviewer: Este se encarga de realizar las pruebas unitarias, linter y otras cosas, y revisar de que las convenciones que existen en el agents y en la documentación se hayan cumplido. Si esto no es así, la gente vuelve a llamar a la instancia nueva del implementador con los cambios específicos que tiene que hacer. Eso mejora la eficiencia, ya que el implementer se levanta de nuevo con contexto limpio y no tiene cosas que el agente implementador anterior puede que haya inferido, o tomado decisiones que no van con los lineamientos de mi proyecto.
- Design reviewer: Este se encarga de que, en el caso del front-end, el contenido haga match con el mockup, la imagen o el diseño entregado cumpla con los criterios de aceptación. Y si no lo hace, vuelve a llamar al agente implementer con los cambios solicitados.este se encarga de que, en el caso del frontend, el contenido haga match con el mockup, la imagen o el diseño entregado, cumpla con los criterios de aceptación y, si no lo hace, vuelva a llamar al agente implementer con los cambios solicitados.

Actualmente ciertos checks ya los hace el CI/CD como los checks de seguridad, codigo repetido y demas, pero este approach permite no depender de esperar esos checks para saber que el codigo esta listo. Además, para ciertas tareas puedo dejarlas trabajando en paralelo a través de un word tree de GitHub. Recientemente me ha servido mucho utilizar los stack beards, ya que actualmente con la cantidad de código inmenso que se está generando, es muy difícil seguir el ritmo de las revisiones. Entonces, una forma que me ayuda a tener cierto track es separar en varios bloques los componentes, los servicios y luego su integración en PRs diferentes. Tratar de no excederme de la cantidad de línea de código de cada PR. Así, de esa manera, es más fácil para el reviewer que lo revise y luego lo apruebe. además, para ciertas tareas puedo dejarlas trabajando en paralelo a través de un Word Tree de GitHub. Recientemente me ha servido mucho utilizar los Stack PRs, ya que actualmente, con la cantidad inmensa de código que se está generando, es muy difícil seguir el ritmo de las revisiones.

Una forma que me ayuda a tener cierto track es separar en varios bloques los componentes, los servicios y luego su integración en PRs diferentes. Tratar de no excederme en la cantidad de líneas de código de cada PR. De esa manera, es más fácil para el reviewer que lo revise y luego lo pruebe.

 Todavía sigo iterando bajo esta premisa, ya que existen mejores herramientas, como por ejemplo Kiro, que utilizan spec-driven development a través de una GUI para poder orquestar ciertos agentes. Y como menciona en la documentación de Kiro, tú puedes tener un agente con un modelo de inteligencia artificial diferente para ciertas tareas, dependiendo de la necesidad. Yo actualmente, debido a mi trabajo, utilizo solo Cloud Code, pero es una alternativa interesante si buscas utilizar este approach para desarrollar. todavía sigo iterando bajo esta premisa, ya que existen mejores herramientas, como por ejemplo Kiro, que utilizan spec-driven development a través de un AI para poder orquestar ciertos agentes. Como mencionan en la documentación de Kiro, tú puedes tener un agente para un agente con un modelo de inteligencia artificial diferente para ciertas tareas, dependiendo de las necesidades. Yo actualmente, debido a mi trabajo, utilizo solo Claude Code, pero es una alternativa interesante si buscas utilizar este approach para desarrollar 

## Referencias

- [Spec kit](https://github.com/github/spec-kit#spec-driven-development)
- [Spec driven development](https://medium.com/@mpholoane/intro-to-spec-driven-development-the-structured-way-to-build-large-applications-with-ai-117a18ee92b6)
- [Kiro](https://kiro.dev/)

