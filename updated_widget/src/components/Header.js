import { ArrowLeft, Menu } from 'lucide-react'
import React from 'react'
import Logo from './Logo'

function Header({ setCurrentView, path = null, isHistory = false }) {
    return (
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => setCurrentView(path ? path : 'home')}>
                <ArrowLeft size={24} />
            </button>
            {!isHistory &&
                <>
                    <Logo />
                    <Menu size={24} onClick={() => setCurrentView('history_list')} />
                </>
            }
        </div>
    )
}

export default Header