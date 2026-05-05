import { Section } from '@/components/ui/Section';

export function Contact() {
  return (
    <Section id="contact" theme="dark">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-2xs text-paper/50 tracking-[0.32em] uppercase">
            06 — Contact
          </p>
          <h2 className="text-paper mt-6 text-2xl leading-tight tracking-tight">
            Let's build something
            <br />
            considered together.
          </h2>
          <p className="text-paper/70 mt-6 max-w-[40ch] text-sm">
            Available for select front-end and product work. Reply within a day
            or two.
          </p>
          <ul className="text-paper mt-8 space-y-2 text-sm">
            <li>
              <a
                href="mailto:orzechowskifranek@gmail.com"
                className="hover:text-primary-300"
              >
                orzechowskifranek@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://github.com/fraorzi"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary-300"
              >
                github.com/fraorzi
              </a>
            </li>
          </ul>
        </div>

        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          className="space-y-5 md:col-span-7"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>
              Don't fill this out:
              <input name="bot-field" />
            </label>
          </p>

          <Field label="Name" name="name" type="text" />
          <Field label="Email" name="email" type="email" />
          <FieldTextArea label="Message" name="message" />

          <button
            type="submit"
            className="bg-primary-600 text-2xs text-paper hover:bg-primary-500 rounded-full px-5 py-2 tracking-[0.18em] uppercase transition-colors"
          >
            Send message
          </button>
        </form>
      </div>
    </Section>
  );
}

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <label className="block">
      <span className="text-2xs text-paper/50 tracking-[0.24em] uppercase">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required
        className="border-paper/15 text-paper placeholder-paper/30 focus:border-primary-400 mt-2 w-full border-b bg-transparent py-2 text-sm transition-colors outline-none"
      />
    </label>
  );
}

function FieldTextArea({ label, name }: { label: string; name: string }) {
  return (
    <label className="block">
      <span className="text-2xs text-paper/50 tracking-[0.24em] uppercase">
        {label}
      </span>
      <textarea
        name={name}
        rows={4}
        required
        className="border-paper/15 text-paper placeholder-paper/30 focus:border-primary-400 mt-2 w-full resize-none border-b bg-transparent py-2 text-sm transition-colors outline-none"
      />
    </label>
  );
}
