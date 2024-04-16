import { useState, useEffect} from "react";
import useWebSocket from 'react-use-websocket';
import AutoPanel from "./AutoPanel";
import ManualPanel from "./ManualPanel";
import RtGraph from "./RtGraph";
import MyInputField from "./MyInputField";

const ControlPanel = () => {
    const [panelState, setPanelState] = useState("auto")
    const [critTemp, setCritTemp] = useState('')
    const [tempData, setTempData] = useState([])
    const [xAxisTime, setXAxisTime] = useState([])
    const socketUrl = "ws://192.168.0.104:81"
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl,{
        share: true,
        shouldReconnect: () => true,
      },);

    useEffect(() => {
        if(lastMessage != null){
        console.log(`Got a new message: ${lastMessage.data}`)
        setTempData(prev => [...prev, lastMessage.data])
        let currentDate = new Date();
        let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
        setXAxisTime(prev => [...prev, time])
        }
      }, [lastMessage])

    const graphData = {
        labels : xAxisTime,
        datasets : [
            {
                label: "Температура",
                data: tempData,
                borderColor: "rgb(75,192,192)",
            },
        ],
    }

    const chagnePanelState = () =>{
        setPanelState(prev => {
            if (prev === "auto"){return "manual"}
            else {return "auto"}
        })
    }

    const sendDataPromise = (data, sendFunc, wsState) =>{
        const customPromise = new Promise((resolve, reject) =>{
            if(wsState === 1){
                sendFunc(data)
                resolve()
            }
            else{
                console.log("Connection isnt open cannot send data")
                reject()
            }
        })
        return customPromise
    }

    return (
    <div className="container">

        <span className="fs-2 bold text-center">{`Система находится в ${panelState === 'manual' ? 'ручном' : 'автоматическом'} режиме`}</span>

        <div className="row justify-content-evenly border border-primary m-2">
        <AutoPanel panelState={panelState} changePanelState={chagnePanelState} sendData={sendDataPromise} wsState = {readyState} wsSend = {sendMessage}/>
        <ManualPanel panelState={panelState} changePanelState={chagnePanelState} sendData={sendDataPromise} wsState = {readyState} wsSend = {sendMessage}/>
        </div>
        <div className="row justify-content-evenly border border-primary m-5">
            <div className="col-3 d-flex flex-column justify-content-center">
                <span className="fs-5 bold text-center">Текущая критическая темпрература: {critTemp}</span>
                <MyInputField name={"Критическая температура"} onSend={setCritTemp} />
                {lastMessage != null ? <span className="fs-5 bold text-center mt-3 mb-3">Статус: {lastMessage.data >= critTemp ? "Критическое состояние" : "Все в норме"}</span> : null}
            </div>
            <div className="col-9">
                <RtGraph data={graphData}/>
            </div>
        </div>
    </div>
    )
}

export default ControlPanel