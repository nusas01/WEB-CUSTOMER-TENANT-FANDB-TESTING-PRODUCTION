import "../style/empty.css"
import { FileX, ShoppingBag, Clock, AlertCircle } from 'lucide-react';

export function EmptyComponent({ gambar, title, desc }) {
    return (
        <div className="container-elament-empty">
            <img src={gambar} alt="Empty" />
            <h1>{title}</h1>
            <p>{desc}</p>
        </div>
    );
}


export const EmptyHistory = ({ icon = "FileX", title, desc }) => {
    // Icon mapping
    const iconMap = {
        FileX: FileX,
        ShoppingBag: ShoppingBag,
        Clock: Clock,
        AlertCircle: AlertCircle,
        // Add more icons as needed
    };
    
    const IconComponent = iconMap[icon] || FileX;
    
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>
            
            {/* Main content */}
            <div className="relative z-10 max-w-md mx-auto">
                {/* Icon container with modern styling */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center shadow-lg border border-gray-100 backdrop-blur-sm group hover:scale-105 transition-transform duration-300">
                        <IconComponent 
                            className="w-16 h-16 text-gray-400 group-hover:text-gray-600 transition-colors duration-500"
                        />
                    </div>
                    
                    {/* Floating dots decoration */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-200 rounded-full animate-bounce"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-200 rounded-full animate-bounce delay-500"></div>
                </div>
                
                {/* Text content */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                        {title}
                    </h2>
                    
                    <div className="relative">
                        <p className="text-gray-500 leading-relaxed max-w-sm mx-auto text-base">
                            {desc}
                        </p>
                        
                        {/* Subtle underline decoration */}
                        <div className="w-16 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 mx-auto mt-4 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

