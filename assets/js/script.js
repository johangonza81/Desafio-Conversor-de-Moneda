const seleccionada=document.getElementById("seleccion1")
const montoIngresado = document.getElementById("input1")
const resultado=document.getElementById("resultado");
const ctx = document.getElementById('myChart');
const boton=document.getElementById("btn1");
let html="<option value='selected' >Seleccione</option>";
let indicador_grafica=null;
let ultimo_valor=null;
let fechas=[];
let valores=[];
let myChart;
function renderizar_divisas(divisa){
    let nombre_divisa=Object.keys(divisa);
    nombre_divisa.splice(0,3);
    nombre_divisa.forEach(moneda=>{
        html+=`<option value="${moneda}">${moneda}</option>`;
    });
    seleccionada.innerHTML=html;
};

async function request_api(){
try {
    const endpoint= await fetch("https://mindicador.cl/api");
    const res= await endpoint.json();
    await renderizar_divisas(res);
} catch (error) {
    alert(error.message);
}
};
boton.addEventListener("click",async (Event)=>{
    if(seleccionada.value==='selected'){
        alert("Debes seleccionar una divisa");
    }else if(montoIngresado.value>0 && montoIngresado.value!== ""){
        let monto=parseInt(montoIngresado.value);
        let resultado_final=(monto/ultimo_valor).toFixed(2);
        resultado.innerHTML=`$ ${resultado_final}`;
        renderizar_grafica();
        montoIngresado.value="";
      
    }else{
        alert("Debes ingresar un monto");
        montoIngresado.focus();
    }
});

async function ultimos10Valores(moneda){
    try {
        const indicador=await fetch (`https://mindicador.cl/api/${moneda}`);
        const data=await indicador.json();
        indicador_grafica= await data.serie.slice(0,10).reverse();
        ultimo_valor=Number(parseInt(indicador_grafica[indicador_grafica.length-1]['valor']));
        fechas=[];
        valores=[];
        indicador_grafica.forEach(elemento=>{
            fechas.push(elemento.fecha);
            valores.push(parseInt(elemento.valor));
        });
        for(let i=0; i<fechas.length;i++){
            fechas[i]=fechas[i].slice(0,10).split("-").reverse().join("-");
        }
    } catch (error) {
        alert(error.message);
    }
};
seleccionada.addEventListener("change", (Event)=>{
    let moneda= seleccionada.value;
    let valores= ultimos10Valores(moneda);
});

function renderizar_grafica(){
        if (myChart) {
            myChart.destroy();
        }
        myChart =new Chart(ctx, {
    type: 'line',
    data: {
    labels: fechas,
    datasets: [{
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        label: 'Historial de precios',
        data: valores,
        borderWidth: 1
    }]
    }
    });
}
request_api();