import {useState} from 'react';

const Counter = () => {
    const [counter, setCounter] = useState(0)

    return(
        <div className="custom-number-input h-10 w-32 mb-13">
            <label for="custom-input-number" className="w-full text-gray-700 text-lg font-semibold font-mono mt-5">Quantity</label>
            <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                <button data-action="decrement" className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none" onClick={() => {setCounter( counter - 1)}}>
                    <span className="m-auto text-2xl font-thin">−</span>
                </button>
                <input type="number" className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none" name="custom-input-number" value={counter}></input>
                <button data-action="increment" className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer" onClick={() => {setCounter( counter + 1)}}>
                    <span className="m-auto text-2xl font-thin">+</span>
                </button>
            </div>
        </div>
    )
}

export default Counter;


