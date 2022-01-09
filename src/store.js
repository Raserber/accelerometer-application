import { createStore } from "vuex";
import {Motion} from "@capacitor/motion";

export const store = createStore({
    state() {
        return {
            acceleration: [
                0,
                0,
                0,
                0,
                0,
                0
            ],
            acquisition: false,
            checkAcquisition: false,
            reset: false
        }
    },

    mutations: {
        async startAcquisition(state) {
            state.checkAcquisition = true
            state.acquisition = true
            try {
                await DeviceMotionEvent.requestPermission()
            } catch (e) {
                console.log(e)
            }


            state.accelHandler = await Motion.addListener("accel", (event) => {

                state.acceleration = [
                    event.acceleration.x,
                    event.acceleration.y,
                    event.acceleration.z,
                    (event.rotationRate.alpha*Math.PI)/180,
                    (event.rotationRate.beta*Math.PI)/180,
                    (event.rotationRate.gamma*Math.PI)/180,
                ]
            })
        },

        stopAcquisition(state) {
            state.acquisition = false
            state.accelHandler.remove()
        },

        reset(state) {
            state.reset = !state.reset
            state.acquisition = false
            state.checkAcquisition = false
        }
    }
})
