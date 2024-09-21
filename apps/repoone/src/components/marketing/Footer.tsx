import { Container } from "./Container";
import { NavLink } from "./NavLink";
export function Footer() {
  return (
    <footer className="bg-[#0D0010] text-white">
      <Container>
        <div className="py-16">
          <nav className="mt-10 text-lg font-semibold" aria-label="quick links">
            <div className="-my-1 flex flex-col items-center justify-center gap-x-6 sm:flex-row">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#testimonials">Testimonials</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
            </div>
          </nav>
        </div>
        <div className="flex items-center pb-10 sm:justify-between">
          <p className="text-sm sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} OpCalc. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <div className="h-6 w-6 rounded-full bg-zinc-300" />
            <div className="h-6 w-6 rounded-full bg-zinc-300" />
            <div className="h-6 w-6 rounded-full bg-zinc-300" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
