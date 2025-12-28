import { useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

interface TooltipProps {
    content: string;
    children: ReactNode;
    delay?: number;
    maxWidth?: number;
}

export function Tooltip({ content, children, delay = 400, maxWidth = 400 }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, placement: 'top' as 'top' | 'bottom' });
    const triggerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | null>(null);

    const calculatePosition = () => {
        if (!triggerRef.current) return;

        // Get the actual card element inside the trigger
        const cardElement = triggerRef.current.querySelector('.skill-card') || triggerRef.current.firstElementChild;
        if (!cardElement) return;

        const rect = cardElement.getBoundingClientRect();
        const tooltipHeight = 150; // Estimated height
        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;

        // Determine if tooltip should appear above or below
        const placement = spaceAbove > tooltipHeight + 20 || spaceAbove > spaceBelow ? 'top' : 'bottom';

        // Calculate center position, ensuring tooltip stays within viewport
        let left = rect.left + rect.width / 2;
        const halfMaxWidth = maxWidth / 2;

        // Clamp to viewport
        if (left - halfMaxWidth < 20) {
            left = halfMaxWidth + 20;
        } else if (left + halfMaxWidth > window.innerWidth - 20) {
            left = window.innerWidth - halfMaxWidth - 20;
        }

        setPosition({
            top: placement === 'top' ? rect.top - 12 : rect.bottom + 12,
            left,
            placement
        });
    };

    const showTooltip = () => {
        timeoutRef.current = window.setTimeout(() => {
            calculatePosition();
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Don't show tooltip for very short content (already visible in card)
    if (content.length < 50) {
        return <>{children}</>;
    }

    return (
        <>
            <div
                ref={triggerRef}
                className="tooltip-trigger"
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
            >
                {children}
            </div>

            {isVisible && createPortal(
                <div
                    className={`tooltip-container tooltip-${position.placement}`}
                    style={{
                        top: position.top,
                        left: position.left,
                        maxWidth: maxWidth,
                    }}
                >
                    <div className="tooltip-content">
                        <div className="tooltip-label">Full Description</div>
                        <p className="tooltip-text">{content}</p>
                    </div>
                    <div className="tooltip-arrow" />
                </div>,
                document.body
            )}
        </>
    );
}
