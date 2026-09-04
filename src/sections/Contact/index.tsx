import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { contact, contactCopy, sections } from '@/content/site';
import { SectionShell } from '@/components/layout/SectionShell';
import {
  StatefulButton,
  type ButtonState,
} from '@/components/ui/button/StatefulButton';
import { TextReveal } from '@/components/ui/TextReveal';

const meta = sections[5];
const EASE = [0.16, 1, 0.3, 1] as const;

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
          <TextReveal
            as="h2"
            text={contactCopy.title}
            split="word"
            whileInView
            blur={4}
            yOffset="30%"
            className="text-2xl leading-tight tracking-tight"
          />
          <p className="text-muted-foreground mt-6 max-w-[40ch] text-sm">
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
            index={0}
          />
          <Field
            label={contactCopy.fields.email}
            name="email"
            type="email"
            autoComplete="email"
            index={1}
          />
          <Field
            label={contactCopy.fields.message}
            name="message"
            multiline
            index={2}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            className="flex items-center gap-4 pt-2"
          >
            <StatefulButton
              type="submit"
              state={state}
              size="sm"
              loadingText={contactCopy.sending}
              successText={contactCopy.sent}
              errorText={contactCopy.failed}
              className="text-2xs h-9 px-5 tracking-[0.16em] uppercase"
            >
              {contactCopy.submit}
            </StatefulButton>
            <span className="text-2xs text-muted-foreground">
              {contactCopy.note}
            </span>
          </motion.div>
        </form>
      </div>
    </SectionShell>
  );
}

type FieldProps = {
  label: string;
  name: string;
  index: number;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
};

function Field({
  label,
  name,
  index,
  type = 'text',
  autoComplete,
  multiline = false,
}: FieldProps) {
  const id = `contact-${name}`;
  const inputClass =
    'peer text-foreground placeholder:text-muted-foreground/60 mt-2 w-full bg-transparent py-2 text-sm outline-none focus-visible:outline-none';

  return (
    <div className="relative">
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.8 }}
        className="block overflow-hidden"
      >
        <motion.label
          htmlFor={id}
          variants={{ hidden: { y: '110%' }, visible: { y: '0%' } }}
          transition={{ duration: 0.8, delay: index * 0.12, ease: EASE }}
          className="text-2xs text-muted-foreground block tracking-[0.2em] uppercase"
        >
          {label}
        </motion.label>
      </motion.span>
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
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1, delay: 0.15 + index * 0.12, ease: EASE }}
        className="bg-border absolute inset-x-0 bottom-0 h-px origin-left"
      />
      <span
        aria-hidden
        className="bg-primary-500 absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] peer-focus:scale-x-100"
      />
    </div>
  );
}
