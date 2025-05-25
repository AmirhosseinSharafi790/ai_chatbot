import { ReceiptText , Minus } from "lucide-react";
import FixedSidebar from "@/components/Fixed-Sidebar/FixedSidebar.jsx";
export default function TermsOfUse(){
    return(
        <>
        <FixedSidebar/>
        <div className="h-screen flex flex-col gap-y-6 py-8 px-4">
            <div className="flex items-center justify-start gap-x-4">
            <ReceiptText size="40px" />
            <h2 className="text-3xl">
            شرایط و قوانین استفاده از خدمات هوشیار
            </h2>
            </div>
            <p className="text-xl opacity-80 px-16">
            اگر اینترنت + حساب کاربری داشته باشی و قوانین و شرایط استقاده هم بپذیری؛ از  هوشیار میتونی استفاده کنی. برای کارهای حرفه‌ای‌تر باید دانش فنی هم داشته باشی.
            </p>
            <div className="flex px-12 flex-col gap-y-4">
                <div className="flex p-2 flex-col gap-y-4">
                    <h2 className="text-xl flex gap-x-1 items-center"><Minus /> شرایط فنی</h2>
                    <p className="opacity-80 px-4">
                    1. اگر میخوای برنامه‌نویسی بکنی یا پروژه واقعی روی AI بسازی؛ نیاز به دانش فنی پایه داری (مثلاً Python، کار با APIها، مدل‌های یادگیری ماشین)
                    <br/>
                    <br/>
                    2. منابع سخت‌افزاری قوی (مثل GPU) ممکنه لازم باشه اگر خودت میخوای مدل بسازی یا آموزش بدی
                    <br/>
                    <br/>
                    3. اگر صرفاً مصرف‌کننده هستی (مثلاً متن تولید می‌کنی یا تصویر خلق می‌کنی)، نیاز خاصی نیست؛ فقط ابزار رو باید بلد باشی چطور استفاده کنی.
                    </p>
                </div>
                <div className="flex p-2 flex-col gap-y-4">
                    <h2 className="text-xl flex gap-x-1 items-center"><Minus /> شرایط قانونی و اخلاقی</h2>
                    <p className="opacity-80 px-4">
                    1. باید حواست باشه که کجا و چطور از AI استفاده می‌کنی
                    <br/>
                    <br/>
                    2. احترام به حقوق کپی‌رایت
                    <br/>
                    <br/>
                    3. عدم تولید محتوای مضر یا گمراه‌کننده
                    </p>
                </div>
                <div className="flex p-2 flex-col gap-y-4">
                    <h2 className="text-xl flex gap-x-1 items-center"><Minus /> بعضی محدودیت‌ها</h2>
                    <p className="opacity-80 px-4">
                        1. محدودیت سنی وجود ندارد؛ اما از نوشتن محتوای +18 و جنسی خودداری کنید.
                    </p>
                </div>
            </div>
        </div>
        </>
    )
}