
export default function Loading() {
  return <div className="bg-white rounded-lg h-11 w-11 flex items-center justify-center absolute top-[calc(50%-22px)] left-[calc(50%-22px)] z-20 shadow-mapDo">
    <div className="border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full w-8 h-8 animate-spin"></div>
  </div>
}