window.onload = function(){
    //Variables Globales
    let contenedor=document.querySelector(".contenedor");
    let divCampeones=document.createElement("div")
    divCampeones.classList.add("divcampeones");
    contenedor.appendChild(divCampeones);
    //Hacemos un set para guardar numeros que no se repitan (lo veremos mas adelante)
    let setNumerosAleat=generaRandom();

    //Funcion asincrona para conseguir los datos del json
    async function importJson(){
        let response= await fetch("./js/campeones.json");
        let campeones= await response.json();
        //llamamos a la funcion de pintar
        pintaCampeones(campeones);
    }
    // Ejecutamos la funcion asincrona
    importJson();

    function pintaCampeones(campeones){   

        for (let campeon of campeones){
            //Si coinciden con el id nos los pintara
            if(setNumerosAleat.has(campeon.id)){
                let divcampeon=document.createElement("div");
                divcampeon.classList.add("campeon");
                let imgcampeon=new Image();
                imgcampeon.src=`./img/${campeon.enlace}`;
                //importante el id para que luego el juego reconozca su casilla y no otra
                imgcampeon.id=campeon.id;
                imgcampeon.alt=campeon.nombre;

                divcampeon.appendChild(imgcampeon);
                divCampeones.appendChild(divcampeon);
           }
        }

        //pintamos los huecos para drag&dropear las imagenes

        let divrespuestas=document.createElement("div");
        divrespuestas.classList.add("divrespuestas");
        
        //Creamos 3 de esos huecos
        let numdivs=0;

        //Vamos a generar los divs de respuesta de una con un do while (nos permitiria aumentar las casillas facil)
        do{
            //Utilizamos este bicho del averno de aqui abajo para sacar los aleatorios del set
            //el primer valor es nuestro set, y el segundo el indice
            const valorAleatorio=[...setNumerosAleat][numdivs];

            //un div para cada respuesta
            let divrespuesta=document.createElement("div");
            divrespuesta.classList.add("respuesta");

            let spannombre=document.createElement("span");
            for (let campeon of campeones){
                if(campeon.id==valorAleatorio){
                    //le asignamos una id para luego relacionarlo con las posibles respuestas
                    divrespuesta.id=campeon.id
                    spannombre.classList.add("spannombre");
                    spannombre.textContent=campeon.nombre;
                }
            }
            divrespuesta.appendChild(spannombre);
            divrespuestas.appendChild(divrespuesta);
            numdivs++;
        } while(numdivs!=3)

        contenedor.appendChild(divrespuestas);
        
        //En esta funcion haremos todo lo relacionado con el drag and drop
        asignarFunciones();

        //Generamos un boton simple de reset
        botonReset();
    }

    function generaRandom(){
        let setNumerosAleat= new Set()
        // Generamos 3 aleatorios no repetidos
        while(setNumerosAleat.size<3){            
            setNumerosAleat.add(Math.ceil(Math.random()*16));
        }
        return setNumerosAleat;
    }


    function asignarFunciones(){

        //Cogemos todos los elementos a arrastrar y le damos dragStart
        const campeones= document.querySelectorAll(".campeon");

        for (let campeon of campeones){
            campeon.addEventListener("dragstart",dragStart);
        }
   
        function dragStart(e) {
            //utilizamos el data transfer para coger la imagen al empezar el arrastre
            e.dataTransfer.setData('text/plain', e.target.id);
            console.log(e.target.alt);
        }

        //Lo mismo para los div de respuesta, con las funciones basicas de drag&drop
        const respuestas= document.querySelectorAll(".respuesta");

        for(let respuesta of respuestas){
            respuesta.addEventListener('dragover', dragOver);
            respuesta.addEventListener('drop',drop);
        }
        function dragOver(e) {
            e.preventDefault();
            
        }
   
       function drop(e) {
            e.target.classList.remove('drag-over');
             // Obtiene el elemento dragable
            const imagen = e.dataTransfer.getData('text/plain');
            //Si el id de la imagen es igual que el del target, se desplaza.
            if (imagen==e.target.id){
                const draggable = document.getElementById(imagen);
                // Añade elemento dragable a destino sobre el que se suelta
                e.target.appendChild(draggable);
                e.target.classList.add("acierto");
               } else{
                   e.target.classList.add("fallo");
                   setTimeout(()=> e.target.classList.remove("fallo"),100);
               }      
               
           }
    }

    //creamos un span con icono de FontAwesome(tm)
    function botonReset(){
        let spanreset=document.createElement("span");
        spanreset.classList.add("spanreset");
        spanreset.innerHTML=`<i class="fa-solid fa-rotate-right"></i>`;
        spanreset.addEventListener("click", recargarPagina);
        contenedor.appendChild(spanreset);
    }

    //si lo pulsamos, recarga la pagina
    function recargarPagina(){
        window.location.reload();
    }
}