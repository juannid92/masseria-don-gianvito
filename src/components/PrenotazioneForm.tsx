import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MASSERIA } from "@/data/masseria";

interface PrenotazioneFormProps {
  /** Mostra il titolo della sezione */
  showTitle?: boolean;
  /** Variante di stile */
  variant?: "dark" | "light";
}

const ORARI = ["12:30", "13:00", "13:30", "19:30", "20:00", "20:30", "21:00", "21:30"];

const NUMERO_PERSONE = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

function getMinDate(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export function PrenotazioneForm({ showTitle = true, variant = "dark" }: PrenotazioneFormProps) {
  const [nome, setNome] = useState("");
  const [telefono, setTelefono] = useState("");
  const [data, setData] = useState("");
  const [orario, setOrario] = useState("");
  const [persone, setPersone] = useState("");
  const [note, setNote] = useState("");

  const isLight = variant === "light";
  const textColor = isLight ? "text-[color:var(--carbone)]" : "text-[color:var(--bianco-calce)]";
  const labelColor = isLight
    ? "text-[color:var(--carbone)]/70"
    : "text-[color:var(--bianco-calce)]/70";
  const borderColor = isLight
    ? "border-[color:var(--carbone)]/20"
    : "border-[color:var(--oro-antico)]/40";
  const bgColor = isLight ? "bg-transparent" : "bg-transparent";

  const whatsappUrl = useMemo(() => {
    const parts: string[] = ["Ciao, vorrei prenotare."];

    if (data) {
      const dataFormattata = new Date(data + "T00:00:00").toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      parts.push(`Data: ${dataFormattata}`);
    }

    if (orario) {
      parts.push(`Orario: ${orario}`);
    }

    if (persone) {
      parts.push(`Persone: ${persone}`);
    }

    if (nome) {
      parts.push(`Nome: ${nome}`);
    }

    if (telefono) {
      parts.push(`Tel: ${telefono}`);
    }

    if (note) {
      parts.push(`Note: ${note}`);
    }

    return `${MASSERIA.whatsapp}?text=${encodeURIComponent(parts.join("\n"))}`;
  }, [data, orario, persone, nome, telefono, note]);

  const isFormFilled = nome || telefono || data || orario || persone;

  return (
    <div className={`w-full ${bgColor}`}>
      {showTitle && (
        <div className="mb-8">
          <p className={`font-eyebrow text-[10px] tracking-[0.34em] ${labelColor} mb-2`}>
            Prenota un tavolo
          </p>
          <h3
            className={`font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight ${isLight ? "text-[color:var(--carbone)]" : "text-[color:var(--oro-su-scuro)]"}`}
          >
            Compila il form
          </h3>
          <div className={`mt-4 h-px w-16 bg-[color:var(--oro-antico)]`} />
        </div>
      )}

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormFilled) {
            window.open(whatsappUrl, "_blank");
          }
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Nome */}
          <div className="space-y-2">
            <label
              htmlFor="prenota-nome"
              className={`font-eyebrow text-[10px] tracking-[0.28em] ${labelColor}`}
            >
              Nome *
            </label>
            <Input
              id="prenota-nome"
              type="text"
              placeholder="Mario Rossi"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={`h-12 ${borderColor} ${isLight ? "bg-white text-[color:var(--carbone)] placeholder:text-[color:var(--carbone)]/40" : "bg-transparent text-[color:var(--bianco-calce)] placeholder:text-[color:var(--bianco-calce)]/40"} border focus-visible:ring-[color:var(--oro-antico)]`}
              required
            />
          </div>

          {/* Telefono */}
          <div className="space-y-2">
            <label
              htmlFor="prenota-telefono"
              className={`font-eyebrow text-[10px] tracking-[0.28em] ${labelColor}`}
            >
              Telefono *
            </label>
            <Input
              id="prenota-telefono"
              type="tel"
              placeholder="+39 333 123 4567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={`h-12 ${borderColor} ${isLight ? "bg-white text-[color:var(--carbone)] placeholder:text-[color:var(--carbone)]/40" : "bg-transparent text-[color:var(--bianco-calce)] placeholder:text-[color:var(--bianco-calce)]/40"} border focus-visible:ring-[color:var(--oro-antico)]`}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Data */}
          <div className="space-y-2">
            <label
              htmlFor="prenota-data"
              className={`font-eyebrow text-[10px] tracking-[0.28em] ${labelColor}`}
            >
              Data *
            </label>
            <Input
              id="prenota-data"
              type="date"
              min={getMinDate()}
              value={data}
              onChange={(e) => setData(e.target.value)}
              className={`h-12 ${borderColor} ${isLight ? "bg-white text-[color:var(--carbone)]" : "bg-transparent text-[color:var(--bianco-calce)]"} border focus-visible:ring-[color:var(--oro-antico)] [&::-webkit-calendar-picker-indicator]:invert(${isLight ? 0 : 1})`}
              required
            />
          </div>

          {/* Orario */}
          <div className="space-y-2">
            <label
              htmlFor="prenota-orario"
              className={`font-eyebrow text-[10px] tracking-[0.28em] ${labelColor}`}
            >
              Orario *
            </label>
            <Select value={orario} onValueChange={setOrario} required>
              <SelectTrigger
                id="prenota-orario"
                className={`h-12 ${borderColor} ${isLight ? "bg-white text-[color:var(--carbone)]" : "bg-transparent text-[color:var(--bianco-calce)]"} border focus-visible:ring-[color:var(--oro-antico)]`}
              >
                <SelectValue placeholder="Seleziona" />
              </SelectTrigger>
              <SelectContent>
                {ORARI.map((ora) => (
                  <SelectItem key={ora} value={ora}>
                    {ora}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Numero persone */}
          <div className="space-y-2">
            <label
              htmlFor="prenota-persone"
              className={`font-eyebrow text-[10px] tracking-[0.28em] ${labelColor}`}
            >
              Persone *
            </label>
            <Select value={persone} onValueChange={setPersone} required>
              <SelectTrigger
                id="prenota-persone"
                className={`h-12 ${borderColor} ${isLight ? "bg-white text-[color:var(--carbone)]" : "bg-transparent text-[color:var(--bianco-calce)]"} border focus-visible:ring-[color:var(--oro-antico)]`}
              >
                <SelectValue placeholder="N." />
              </SelectTrigger>
              <SelectContent>
                {NUMERO_PERSONE.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n} {parseInt(n) === 1 ? "persona" : "persone"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label
            htmlFor="prenota-note"
            className={`font-eyebrow text-[10px] tracking-[0.28em] ${labelColor}`}
          >
            Note (allergie, occasioni speciali, ...)
          </label>
          <Textarea
            id="prenota-note"
            placeholder="Eventuali allergie, richieste particolari, festeggiamenti..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className={`${borderColor} ${isLight ? "bg-white text-[color:var(--carbone)] placeholder:text-[color:var(--carbone)]/40" : "bg-transparent text-[color:var(--bianco-calce)] placeholder:text-[color:var(--bianco-calce)]/40"} border focus-visible:ring-[color:var(--oro-antico)] resize-none`}
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className={`
              inline-flex h-14 w-full items-center justify-center gap-3
              ${
                isLight
                  ? "bg-[color:var(--oro-antico)] text-[color:var(--carbone)] hover:bg-[color:var(--oro-antico)]/90"
                  : "bg-[color:var(--oro-antico)] text-[color:var(--carbone)] hover:bg-[color:var(--oro-antico)]/90"
              }
              font-eyebrow text-[11px] tracking-[0.28em]
              transition-all hover:scale-[1.01]
              sm:w-auto sm:px-12
            `}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            PRENOTA TRAMITE WHATSAPP
          </a>
          <p className={`mt-3 text-xs ${labelColor}`}>
            Verrai reindirizzato su WhatsApp con il messaggio già compilato.
          </p>
          <p className={`mt-2 text-xs leading-relaxed ${labelColor}`}>
            I dati inseriti restano nel tuo browser e non vengono salvati dal sito: servono solo a
            preparare il messaggio. Se indichi allergie o intolleranze, acconsenti a che le
            usiamo per servirti in sicurezza. Titolare: Masseria Don Gianvito. Maggiori
            informazioni nella{" "}
            <a href="/legali/privacy" className="underline underline-offset-4">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
