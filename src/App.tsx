import { useState } from "react"

type Segment = {
  name: string
  start: number
  stop: number
}

function App() {


  let [speed, setSpeed] = useState<number>(0);
  let [segments, setSegments] = useState<Segment[]>([{ name: "Seg 1", start: 0, stop: 30 }, { name: "Seg 2", start: 20, stop: 60 }]);

  const preset1 = {
    "mainseg": 0,
    "seg": [
      ...segments.map((segment, index) => ({
        id: index,
        start: segment.start,
        stop: segment.stop,
        grp: 1,
        spc: 0,
        of: 0,
        on: true,
        frz: false,
        bri: 127,
        cct: 127,
        set: 0,
        n: "",
        col: [[255, 0, 0, 0]],
        fx: 98,
        sx: 0,
        ix: 0,
        pal: 0,
        c1: 128,
        c2: 128,
        c3: 16,
        sel: true,
        rev: false,
        mi: false,
        o1: false,
        o2: false,
        o3: false,
        si: 0,
        m12: 0
      }))
    ],
    "n": "INIT"
  }



  let onPreset = segments.map((segment, index) => ({
    mainseg: 0,
    n: `ON - ${segment.name}`,
    seg: [{
      id: index,
      grp: 1,
      spc: 0,
      of: 0,
      on: true,
      frz: false,
      cct: 127,
      set: 0,
      n: segment.name,
      col: [],
      fx: 98,
      sx: speed,
      ix: 100,
      pal: 0,
      c1: 128,
      c2: 128,
      c3: 16,
      sel: true,
      rev: false,
      mi: false,
      o1: false,
      o2: false,
      o3: false,
      si: 0,
      m12: 0
    }]
  }));

  console.log(onPreset.length + 1)


  let offPreset = segments.map((segment, index) => ({
    mainseg: 0,
    n: `OFF - ${segment.name}`,
    seg: [{
      id: index,
      grp: 1,
      spc: 0,
      of: 0,
      on: true,
      frz: false,
      cct: 127,
      set: 0,
      n: segment.name,
      col: [],
      fx: 98,
      sx: speed,
      ix: 0,
      pal: 0,
      c1: 128,
      c2: 128,
      c3: 16,
      sel: true,
      rev: false,
      mi: false,
      o1: false,
      o2: false,
      o3: false,
      si: 0,
      m12: 0
    }]
  }));


  let ob = [{}, { ...preset1, n: "INIT" }, ...onPreset, ...offPreset];
  let onPlaylist = [{
    on: true,
    n: "ON Playlist",
    playlist: {
      ps: [
        ...Array.from({ length: onPreset.length }, (_, i) => i + 2)
      ],
      dur: [
        ...Array.from({ length: onPreset.length }, () => 20)
      ],
      transition: [
        ...Array.from({ length: onPreset.length }, () => 10)
      ],
      repeat: 1,
      end: 0,
      r: false
    }
  }];

  let offPlaylist = [{
    on: true,
    n: "OFF Playlist",
    playlist: {
      ps: [
        ...Array.from({ length: offPreset.length }, (_, i) => onPreset.length + i + 2).reverse()
      ],
      dur: [
        ...Array.from({ length: offPreset.length }, () => 20)
      ],
      transition: [
        ...Array.from({ length: offPreset.length }, () => 10)
      ],
      repeat: 1,
      end: 0,
      r: false
    }
  }];

  ob = [...ob, ...onPlaylist, ...offPlaylist]

  const exportObj = {
    ...ob.map((ob) => ({ ...ob }))
  }



  let addNewSegment = () => {
    let lastSegment = segments[segments.length - 1];
    let newSegment: Segment = {
      name: `Segment ${segments.length + 1}`,
      start: lastSegment.stop,
      stop: lastSegment.stop + 30
    };
    setSegments([...segments, newSegment]);
  }

  let removeSegment = () => {
    if (segments.length > 1) {
      let updatedSegments = segments.slice(0, -1);
      setSegments(updatedSegments);
    }
  }

  let onChangeStop = (value: string, index: number) => {
    let updatedSegments = [...segments];
    updatedSegments[index].stop = Number(value);
    setSegments(updatedSegments);
    updateSegments();
  }

  let onChangeName = (value: string, index: number) => {
    let updatedSegments = [...segments];
    updatedSegments[index].name = value;
    setSegments(updatedSegments);
  }

  let updateSegments = () => {
    let updatedSegments = segments.map((segment, index) => {
      if (index == 0) {
        return { ...segment, start: 0, stop: segment.stop }
      } else {
        console.log({ ...segment, start: segments[index - 1].stop })
        return { ...segment, start: segments[index - 1].stop }
      }
    });

    setSegments([
      ...updatedSegments
    ]);

  }

  function downloadFile() {
    var element = document.createElement('a');
    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().replace(/[:.]/g, '-');
    var fileName = `preset_${formattedDate}.json`;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj)));
    element.setAttribute('download', fileName);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  return (
    <div className="flex w-full  lg:h-full  items-center justify-center ">
      <div className="mx-4 bg-white lg:mx-auto rounded shadow p-4 lg:h-auto relative w-full">
        <div className="w-full flex flex-col items-center">
          <span className="font-medium text-xl py-2">WLED Percent Effekt - Geschwindigkeits Tool</span>
          <div className="w-2/3">
            <div className="flex items-center justify-between">
              <span className="block w-full text-left">Langsam</span>
              <span>{speed}</span>
              <span className="block w-full text-right">Schnell</span>
            </div>
            <div className="w-full"><input type="range" className="w-full" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} min={0} max={255} /></div>
          </div>
          <div className="flex flex-col items-center justify-center lg:w-2/3">
            <div className="w-full">
              <div className="flex flex-row justify-start my-2"><button className="border h-8 w-8 rounded bg-slate-950 text-white text-xl" onClick={() => addNewSegment()}>+</button></div>
            </div>
            <div className="flex flex-row gap-3 w-full">
              <div className="w-8  lg:w-3 "><span></span></div>
              <div className="w-32 lg:w-1/3 "><span>Name</span></div>
              <div className="w-10 lg:w-1/3 "><span>Start</span></div>
              <div className="w-32 lg:w-1/3 "><span>Stop</span></div>
            </div>
            {segments.map((segment: Segment, index) => (
              <div className="flex flex-row gap-3 my-1 w-full" key={segment.start}>
                {segments.length > 1 && index === segments.length - 1 ? (
                  <button className="border w-8 rounded text-xl" onClick={() => removeSegment()}>-</button>
                ) : <div className="w-8"></div>}
                <input type="text" className="border rounded px-2 w-32 lg:w-full" value={segment.name} onChange={(e) => onChangeName(e.target.value, index)} />
                <input type="number" className="border rounded px-2 w-10 lg:w-full" defaultValue={segment.start} disabled />
                <input type="number" className="border rounded px-2 w-32 lg:w-full" value={segment.stop} onChange={(e) => onChangeStop(e.target.value, index)} />
              </div>
            ))}
            <div className="flex flex-col items-center justify-center w-full">
              <button className="bg-blue-500 rounded py-2 px-4 text-white hover:bg-blue-600 focus:ring-4 shadow-lg transform active:scale-75 transition-transform mt-4 " onClick={() => downloadFile()}>Download Preset as Backup File</button>
              <button className="bg-blue-500 rounded py-2 px-4 text-white hover:bg-blue-600 focus:ring-4 shadow-lg transform active:scale-75 transition-transform mt-4 " onClick={() => navigator.clipboard.writeText(JSON.stringify(exportObj))}>Kopieren</button>
            </div>
            <div className="border rounded mt-4 h-64 overflow-scroll w-full">
              <pre className="text-start">{JSON.stringify(exportObj, null, 2)}</pre>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default App
