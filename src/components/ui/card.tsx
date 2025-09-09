import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { useTiltEffect } from "@/hooks/use-tilt-effect"
import { cn } from "@/lib/utils"

interface CardProps extends Omit<HTMLMotionProps<"div">, "onDrag" | "onDragStart" | "onDragEnd"> {
  enableTilt?: boolean;
  tiltIntensity?: number;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, enableTilt = true, tiltIntensity = 8, ...props }, ref) => {
    const tiltRef = useTiltEffect(tiltIntensity);
    
    return (
      <motion.div
        ref={(el) => {
          if (enableTilt) {
            tiltRef.current = el;
          }
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.25, 0.1, 0.25, 1],
          delay: Math.random() * 0.2 
        }}
        className={cn(
          "group relative overflow-hidden rounded-xl border bg-card/80 text-card-foreground shadow-elegant backdrop-blur-sm transition-all duration-500 hover:shadow-glow hover:-translate-y-1",
          enableTilt && "transform-gpu will-change-transform",
          className
        )}
        style={{
          background: enableTilt ? `
            radial-gradient(
              circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              hsla(var(--primary), 0.05) 0%,
              transparent 50%
            ),
            hsla(var(--card), 0.8)
          ` : undefined,
        }}
        {...props}
      >
        {enableTilt && (
          <>
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `
                    radial-gradient(
                      600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                      hsla(var(--primary), 0.1),
                      transparent 40%
                    )
                  `,
                }}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20">
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `
                    radial-gradient(
                      300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                      rgba(255, 255, 255, 0.1),
                      transparent 40%
                    )
                  `,
                }}
              />
            </div>
          </>
        )}
        {props.children as React.ReactNode}
      </motion.div>
    );
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
