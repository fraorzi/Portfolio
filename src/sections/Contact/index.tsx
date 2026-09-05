import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { contact, contactCopy, sections } from '@/content/site';
import { SectionShell } from '@/components/layout/SectionShell';
import {
  StatefulButton,
  type ButtonState,
} from '@/components/ui/button/StatefulButton';

const meta = sections[5];

export function Contact() {
  const [state, setState] = useState<ButtonState>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === 'loading') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setState('loading');
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(
          Array.from(data.entries()).map(([k, v]) => [k, String(v)]),
        ).toString(),
      });
      if (!response.ok) throw new Error(`status ${response.status}`);
      setState('success');
      form.reset();
    } catch {
      setState('error');
      window.setTimeout(() => setState('idle'), 2400);
    }
  };

  return (
    <SectionShell meta={meta}>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="font-display text-2xl leading-tight tracking-tight">
            {contactCopy.title}
          </h2>
          <p className="text-muted-foreground mt-5 max-w-[40ch] text-sm leading-relaxed">
            {contactCopy.lead}
          </p>
          <a
            href={`mailto:${contact.email}`}
            className="text-foreground hover:text-primary-600 mt-8 inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            {contact.email}
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </a>
        </div>

        <form
          name="contact"
          method="POST"
          action="/"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="space-y-7 md:col-span-7"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>
              {contactCopy.honeypot}
              <input name="bot-field" />
            </label>
          </p>

          <Field
            label={contactCopy.fields.name}
            name="name"
            type="text"
            autoComplete="name"
          />
          <Field
            label={contactCopy.fields.email}
            name="email"
            type="email"
            autoComplete="email"
          />
          <Field label={contactCopy.fields.message} name="message" multiline />

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <StatefulButton
              type="submit"
              state={state}
              size="sm"
              loadingText={contactCopy.sending}
              successText={contactCopy.sent}
              errorText={contactCopy.failed}
              className="h-9 px-4 text-sm"
            >
              {contactCopy.submit}
            </StatefulButton>
            <span className="text-muted-foreground text-xs">
              {contactCopy.note}
            </span>
          </div>
        </form>
      </div>
    </SectionShell>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
};

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  multiline = false,
}: FieldProps) {
  const id = `contact-${name}`;
  const inputClass =
    'peer text-foreground placeholder:text-muted-foreground/60 mt-2 w-full bg-transparent py-2 text-sm outline-none focus-visible:outline-none';

  return (
    <div className="relative">
      <label htmlFor={id} className="text-muted-foreground block text-xs">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          required
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required
          autoComplete={autoComplete}
          className={inputClass}
        />
      )}
      <span
        aria-hidden
        className="bg-border absolute inset-x-0 bottom-0 h-px"
      />
      <span
        aria-hidden
        className="bg-primary-500 absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-(--ease-out-expo) peer-focus:scale-x-100"
      />
    </div>
  );
}
