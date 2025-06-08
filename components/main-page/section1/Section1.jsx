import FixedSidebar from "@/components/Fixed-Sidebar/FixedSidebar";
import Card from "./Card";
import CardData from "./CardData";
import Link from "next/link";
export default function Section1(){
    return(
        <div className="flex items-center flex-col p-5 bg-gradient-to-r from-indigo-950 to-[#132243]">
            <h1 className="text-4xl !text-start text-[#788AFC] mt-4">
                هوش مصنوعی را با یک کلیک تجربه کنید.
            </h1>
            <h3 className="!text-start text-2xl my-4">از بین چند مدل قدرتمند انتخاب کنید و گفت‌وگویی هوشمندانه را آغاز کنید.</h3>
            <h4 className="!text-start text-md">گپ بزن، سوال بپرس، کد بنویس یا تصویر بساز. همه چیز رو یک‌جا و بی‌دردسر تجربه کن.</h4>
            <div className="container-card flex flex-wrap mt-8 justify-start">
                {CardData.map( item => (
                    <Card key={item.id} {...item} />
                ) )}
            </div>
            <div className="flex flex-col items-center gap-y-2">
                <h3 className="!text-start text-2xl mt-12">برای یک امتحان هیجان انگیز در دنیای هوش مصنوعی آماده هستید؟</h3>
                <Link href={"/login"} className="w-full my-5 cursor-pointer text-center transition-all delay-75 px-5 py-3 border-2 border-gray-400 hover:bg-[#137df621] rounded-xl">
                    <button className="cursor-pointer">
                        بزن بریم!
                    </button>
                </Link>
                <p className="opacity-65">سریع، ساده و بدون نیاز به هیچ پیچیدگی وارد دنیای هوش مصنوعی شو!</p>
            </div>
            <FixedSidebar/>
        </div>
    )
}
