import { useState } from "react"

const ManualPanel = ({panelState, changePanelState, sendData, wsState, wsSend}) =>{
    const [coolerState, setCoolerState] = useState("Off")
    const panelStyle =  panelState === "manual" ? null : "opacity-25"

    const mainBtnSend = (data) =>{
        sendData(data, wsSend, wsState).then(changePanelState, () => alert("Cannot send data"))
    }

    const setCooler = () =>{
        setCoolerState(prev => {
            if(prev === "On"){return "Off"}
        else{return "On"}
        })
    }
    const onSend = (data) =>{
        sendData(data, wsSend, wsState).then(() => setCooler(), () => alert("Cannot send data"))
    }

    return (
    <div className={`col-6 d-flex flex-column justify-content-center align-items-center border border-primary ${panelStyle}`}>
        <button className={`btn btn-primary btn-lg w-50 m-4 p-5 ${panelState === "manual" ? "disabled" : null}`} onClick={()=>mainBtnSend('m')}>Ручной</button>
        <button className={`btn btn-secondary btn-lg w-50 mt-4 ${panelState === "manual" ? null : "disabled"}`} onClick={() => onSend(coolerState === 'On' ? 'f' : 'n')}>{coolerState}</button>
        <p className="fs-5 text-center m-2">{`Охлаждение ${coolerState === "On" ? "включено" : "выключено"}`}</p>
    </div>
    )
}

export default ManualPanel