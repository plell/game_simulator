import { useControls } from "leva"

type Props = {
    position?: [number, number, number]
    color?:string
}

export const useBasicDebug = (name:string, defaults: Props) => useControls(name, {
    position: {
      value: defaults.position||[0,70,0],
      step: 5,
    },
    intensity: 200,
    visible: true,
    color: { value: defaults.color||"#ffffff" },
  })
