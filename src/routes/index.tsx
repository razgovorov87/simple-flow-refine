import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Concept eValuate — заявка на исследование | ORO" },
      {
        name: "description",
        content:
          "Конфигуратор заявки на тест концепций: рынок, целевая группа, выборка и стоимость рассчитываются автоматически.",
      },
      { property: "og:title", content: "Concept eValuate — заявка на исследование" },
      {
        property: "og:description",
        content:
          "Опишите рынок и целевую группу — мы рассчитаем доступный объём выборки и стоимость проекта.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const GEOS = ["Вся Россия", "Города 1млн+", "Москва и МО"];
const FREQ = ["Минимум 1 раз в месяц", "Минимум 1 раз в неделю", "Раз в полгода"];
const TABS = ["Параметры опроса", "Продукт и конкуренты", "Дополнительно"];

function Index() {
  const [tab, setTab] = useState(0);

  // Шаг 1
  const [geo, setGeo] = useState(GEOS[0]);
  const [gender, setGender] = useState(50);
  const [age, setAge] = useState(35);
  const [cell, setCell] = useState(150);
  const [concepts, setConcepts] = useState(2);
  const [support, setSupport] = useState<"self" | "manager">("self");

  // Шаг 2
  const [product, setProduct] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([""]);
  const [logo, setLogo] = useState<string | null>(null);
  const logoInput = useRef<HTMLInputElement>(null);

  // Шаг 3
  const [extras, setExtras] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const total = useMemo(() => cell * Math.max(1, concepts), [cell, concepts]);
  const price = useMemo(
    () => total * 475 + (support === "manager" ? 45000 : 0),
    [total, support],
  );

  const toggleExtra = (v: string) =>
    setExtras((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const onLogo = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20">
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-foreground">
              <div className="size-3 rounded-full bg-background" />
            </div>
            <span className="text-xl font-bold tracking-tighter">ORO</span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Каталог решений
            </a>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[10px] text-accent-foreground">
                {tab + 1}
              </span>
              <span>{TABS[tab]}</span>
            </div>
          </div>
        </div>
        <button className="rounded-pill bg-foreground px-6 py-2 text-sm font-semibold text-background transition-all hover:bg-foreground/90">
          Войти
        </button>
      </nav>

      <main className="mx-auto max-w-[1280px] px-6 py-10">
        <header className="mb-8 max-w-2xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-balance">
            Заявка на исследование <span className="text-accent">Concept eValuate</span>
          </h1>
          <p className="text-muted text-pretty">
            Опишите целевую группу и параметры рынка. На основе этих вводных мы рассчитаем
            доступный объём выборки и стоимость проекта.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Вкладки */}
            <div
              role="tablist"
              aria-label="Шаги заявки"
              className="mb-6 flex gap-1 rounded-card bg-input p-1 ring-1 ring-border"
            >
              {TABS.map((t, i) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === i}
                  onClick={() => setTab(i)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
                    tab === i
                      ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <span
                    className={`hidden size-5 items-center justify-center rounded-full text-[10px] sm:flex ${
                      tab === i
                        ? "bg-accent text-accent-foreground"
                        : i < tab
                          ? "bg-accent/20 text-accent"
                          : "bg-foreground/10 text-muted"
                    }`}
                  >
                    {i < tab ? "✓" : i + 1}
                  </span>
                  {t}
                </button>
              ))}
            </div>

            {/* Шаг 1 */}
            {tab === 0 && (
              <div className="space-y-6">
                <section className="animate-slide-up rounded-card bg-card p-8 ring-1 ring-border">
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-xl font-bold">1. Рынок</h2>
                    <span className="rounded bg-input px-2 py-1 font-mono text-xs text-muted">
                      ОБЯЗАТЕЛЬНО
                    </span>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold">Категория*</label>
                      <input
                        type="text"
                        placeholder="Например: Сладкие газированные напитки"
                        className="w-full rounded-xl border-none bg-input px-4 py-3 text-sm outline-none transition-all placeholder:text-muted/50 focus:ring-2 focus:ring-accent/20"
                      />
                      <p className="ml-1 text-[11px] text-muted">
                        Начните вводить название категории для автоподбора
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold">Частота покупки*</label>
                      <select className="w-full cursor-pointer appearance-none rounded-xl border-none bg-input px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/20">
                        {FREQ.map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                <section className="animate-slide-up rounded-card bg-card p-8 ring-1 ring-border [animation-delay:100ms]">
                  <h2 className="mb-8 text-xl font-bold">2. Целевая группа</h2>

                  <div className="space-y-10">
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold">География исследования</label>
                      <div className="flex flex-wrap gap-2">
                        {GEOS.map((g) => (
                          <button
                            key={g}
                            onClick={() => setGeo(g)}
                            className={`rounded-pill px-4 py-2 text-xs font-medium transition-transform active:scale-95 ${
                              geo === g
                                ? "bg-accent text-accent-foreground"
                                : "bg-input text-muted hover:bg-foreground/5"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-12 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-end justify-between">
                          <label className="text-sm font-semibold">Пол</label>
                          <button
                            onClick={() => setGender(50)}
                            className="cursor-pointer text-[11px] font-medium text-accent"
                          >
                            Сбросить
                          </button>
                        </div>
                        <div className="flex h-12 w-full overflow-hidden rounded-xl ring-1 ring-border">
                          <div
                            className="flex flex-col items-center justify-center border-r border-border bg-accent/10 transition-all"
                            style={{ flex: gender }}
                          >
                            <span className="text-[10px] font-bold uppercase text-accent">
                              Мужчины
                            </span>
                            <span className="font-mono font-medium">{gender}%</span>
                          </div>
                          <div
                            className="flex flex-col items-center justify-center bg-card transition-all"
                            style={{ flex: 100 - gender }}
                          >
                            <span className="text-[10px] font-bold uppercase text-muted">
                              Женщины
                            </span>
                            <span className="font-mono font-medium">{100 - gender}%</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={90}
                          step={5}
                          value={gender}
                          onChange={(e) => setGender(Number(e.target.value))}
                          className="w-full accent-accent"
                          aria-label="Соотношение по полу"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-end justify-between">
                          <label className="text-sm font-semibold">Возраст</label>
                          <button
                            onClick={() => setAge(50)}
                            className="cursor-pointer text-[11px] font-medium text-accent"
                          >
                            Сбросить
                          </button>
                        </div>
                        <div className="flex h-12 w-full overflow-hidden rounded-xl ring-1 ring-border">
                          <div
                            className="flex flex-col items-center justify-center border-r border-border bg-accent/10 transition-all"
                            style={{ flex: age }}
                          >
                            <span className="text-[9px] font-bold text-accent">18-34</span>
                            <span className="font-mono text-xs">{age}%</span>
                          </div>
                          <div
                            className="flex flex-col items-center justify-center bg-card transition-all"
                            style={{ flex: 100 - age }}
                          >
                            <span className="text-[9px] font-bold text-muted">35-64</span>
                            <span className="font-mono text-xs">{100 - age}%</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={90}
                          step={5}
                          value={age}
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-full accent-accent"
                          aria-label="Соотношение по возрасту"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="animate-slide-up rounded-card bg-card p-8 ring-1 ring-border [animation-delay:200ms]">
                  <h2 className="mb-8 text-xl font-bold">3. Объём и формат</h2>

                  <div className="mb-8 grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold">Выборка на ячейку</label>
                      <input
                        type="number"
                        min={150}
                        max={300}
                        value={cell}
                        onChange={(e) => setCell(Number(e.target.value))}
                        className="w-full rounded-xl border-none bg-input px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-accent/20"
                      />
                      <p className="ml-1 text-[11px] text-muted">
                        Рекомендуемый минимум: 150 респондентов
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold">Количество концепций</label>
                      <input
                        type="number"
                        min={1}
                        max={14}
                        value={concepts}
                        onChange={(e) => setConcepts(Number(e.target.value))}
                        className="w-full rounded-xl border-none bg-input px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-accent/20"
                      />
                      <p className="ml-1 text-[11px] text-muted">От 1 до 14 концепций</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="ml-1 text-sm font-semibold">Сопровождение проекта</label>
                    <div className="space-y-3">
                      <SupportOption
                        active={support === "self"}
                        onClick={() => setSupport("self")}
                        title="Самостоятельное проведение"
                        desc="Базовый функционал платформы без менеджера"
                      />
                      <SupportOption
                        active={support === "manager"}
                        onClick={() => setSupport("manager")}
                        title="Персональный менеджер"
                        desc="Полное сопровождение и отчётность специалистом"
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Шаг 2 */}
            {tab === 1 && (
              <div className="space-y-6">
                <section className="animate-slide-up rounded-card bg-card p-8 ring-1 ring-border">
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-xl font-bold">1. Ваш продукт</h2>
                    <span className="rounded bg-input px-2 py-1 font-mono text-xs text-muted">
                      ОБЯЗАТЕЛЬНО
                    </span>
                  </div>

                  <div className="grid gap-8 md:grid-cols-[1fr_200px]">
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold">Описание продукта*</label>
                      <textarea
                        rows={6}
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        placeholder="Кратко опишите продукт и его ключевое отличие: состав, формат, позиционирование, для кого он"
                        className="w-full resize-none rounded-xl border-none bg-input px-4 py-3 text-sm outline-none transition-all placeholder:text-muted/50 focus:ring-2 focus:ring-accent/20"
                      />
                      <p className="ml-1 text-[11px] text-muted">
                        Это описание увидят респонденты в начале опроса
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold">Логотип</label>
                      <input
                        ref={logoInput}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onLogo(e.target.files?.[0])}
                      />
                      <button
                        onClick={() => logoInput.current?.click()}
                        className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl bg-input text-muted transition-all hover:bg-foreground/5 focus:ring-2 focus:ring-accent/20"
                      >
                        {logo ? (
                          <img
                            src={logo}
                            alt="Логотип продукта"
                            className="size-full rounded-xl object-contain p-3"
                          />
                        ) : (
                          <>
                            <span className="text-2xl">＋</span>
                            <span className="px-3 text-center text-[11px] leading-tight">
                              Загрузить логотип
                              <br />
                              PNG или SVG
                            </span>
                          </>
                        )}
                      </button>
                      {logo && (
                        <button
                          onClick={() => setLogo(null)}
                          className="ml-1 text-[11px] font-medium text-accent"
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>
                </section>

                <section className="animate-slide-up rounded-card bg-card p-8 ring-1 ring-border [animation-delay:100ms]">
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-xl font-bold">2. Конкуренты</h2>
                    <span className="rounded bg-input px-2 py-1 font-mono text-xs text-muted">
                      ДО 5 БРЕНДОВ
                    </span>
                  </div>

                  <div className="space-y-3">
                    {competitors.map((c, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-input font-mono text-xs text-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <input
                          type="text"
                          value={c}
                          onChange={(e) =>
                            setCompetitors((prev) =>
                              prev.map((x, j) => (j === i ? e.target.value : x)),
                            )
                          }
                          placeholder="Название бренда-конкурента"
                          className="w-full rounded-xl border-none bg-input px-4 py-3 text-sm outline-none transition-all placeholder:text-muted/50 focus:ring-2 focus:ring-accent/20"
                        />
                        {competitors.length > 1 && (
                          <button
                            onClick={() =>
                              setCompetitors((prev) => prev.filter((_, j) => j !== i))
                            }
                            aria-label="Удалить конкурента"
                            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}

                    {competitors.length < 5 && (
                      <button
                        onClick={() => setCompetitors((prev) => [...prev, ""])}
                        className="mt-1 rounded-pill bg-input px-4 py-2 text-xs font-medium text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
                      >
                        + Добавить конкурента
                      </button>
                    )}
                    <p className="ml-1 text-[11px] text-muted">
                      Респонденты сравнят ваш продукт с этими брендами
                    </p>
                  </div>
                </section>
              </div>
            )}

            {/* Шаг 3 */}
            {tab === 2 && (
              <div className="space-y-6">
                <section className="animate-slide-up rounded-card bg-card p-8 ring-1 ring-border">
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Дополнительные опции</h2>
                    <span className="rounded bg-input px-2 py-1 font-mono text-xs text-muted">
                      НЕОБЯЗАТЕЛЬНО
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      ["pack", "Тест упаковки", "Оценка дизайна и читаемости упаковки"],
                      ["price", "Тест цены", "Восприятие ценности и готовность платить"],
                      ["ads", "Тест рекламных материалов", "Ролики, баннеры, ключевые сообщения"],
                      ["deep", "Глубинная аналитика", "Расширенный отчёт с сегментацией"],
                    ].map(([key, title, desc]) => (
                      <button
                        key={key}
                        onClick={() => toggleExtra(key)}
                        className={`flex w-full items-center gap-4 rounded-xl p-4 text-left transition-colors ${
                          extras.includes(key)
                            ? "bg-accent text-accent-foreground"
                            : "bg-input hover:bg-foreground/5"
                        }`}
                      >
                        <div
                          className={`flex size-5 items-center justify-center rounded-md border-2 ${
                            extras.includes(key)
                              ? "border-accent-foreground/50"
                              : "border-foreground/10"
                          }`}
                        >
                          {extras.includes(key) && (
                            <span className="text-[10px] font-bold">✓</span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{title}</div>
                          <div
                            className={`text-[11px] ${
                              extras.includes(key) ? "opacity-80" : "text-muted"
                            }`}
                          >
                            {desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="animate-slide-up rounded-card bg-card p-8 ring-1 ring-border [animation-delay:100ms]">
                  <h2 className="mb-6 text-xl font-bold">Комментарий к заявке</h2>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Особые пожелания, сроки, вопросы команде…"
                    className="w-full resize-none rounded-xl border-none bg-input px-4 py-3 text-sm outline-none transition-all placeholder:text-muted/50 focus:ring-2 focus:ring-accent/20"
                  />
                </section>
              </div>
            )}

            {/* Навигация по шагам */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setTab((t) => Math.max(0, t - 1))}
                disabled={tab === 0}
                className="rounded-pill px-6 py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                ← Назад
              </button>
              {tab < TABS.length - 1 ? (
                <button
                  onClick={() => setTab((t) => t + 1)}
                  className="rounded-pill bg-foreground px-8 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 active:scale-95"
                >
                  Далее: {TABS[tab + 1]} →
                </button>
              ) : (
                <span className="text-xs text-muted">
                  Всё готово — подтвердите заявку в сводке справа
                </span>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:col-span-4">
            <div className="animate-slide-up rounded-card bg-foreground p-8 text-background shadow-2xl [animation-delay:300ms]">
              <h3 className="mb-6 font-mono text-xs uppercase tracking-widest text-background/50">
                Сводка заявки
              </h3>

              <div className="mb-8 space-y-6">
                <SummaryRow label="Общая выборка" value={total.toLocaleString("ru-RU")} mono />
                <SummaryRow label="Концепций" value={String(concepts).padStart(2, "0")} mono />
                <SummaryRow
                  label="Конкурентов"
                  value={String(competitors.filter(Boolean).length).padStart(2, "0")}
                  mono
                />
                <SummaryRow label="Срок теста" value="5-7 раб. дней" />
              </div>

              <div className="mb-8 space-y-1">
                <span className="font-mono text-[10px] uppercase text-background/40">
                  Итоговая стоимость
                </span>
                <div className="text-4xl font-extrabold tracking-tighter">
                  {price.toLocaleString("ru-RU")} ₽
                </div>
                <p className="mt-4 text-[10px] font-medium leading-relaxed text-accent">
                  * Расчёт для стандартного решения.
                  <br />
                  Нужна кастомизация?{" "}
                  <a href="#" className="underline">
                    Оставьте заявку
                  </a>
                </p>
              </div>

              <button className="w-full rounded-pill bg-accent py-4 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-95">
                Войти и продолжить
              </button>
            </div>

            <div className="mt-6 rounded-card bg-accent/5 p-6 ring-1 ring-accent/10">
              <p className="text-[12px] leading-relaxed text-foreground/70">
                Данные обновляются автоматически при каждом изменении параметров. Мы зафиксируем
                цену на 24 часа после сохранения.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-background/10 py-2">
      <span className="text-sm text-background/70">{label}</span>
      <span className={mono ? "font-mono text-lg font-medium" : "text-sm font-medium"}>
        {value}
      </span>
    </div>
  );
}

function SupportOption({
  active,
  onClick,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-xl p-4 text-left transition-colors ${
        active ? "bg-accent text-accent-foreground" : "bg-input hover:bg-foreground/5"
      }`}
    >
      <div
        className={`flex size-5 items-center justify-center rounded-full border-2 ${
          active ? "border-accent-foreground/50" : "border-foreground/10"
        }`}
      >
        {active && <div className="size-2 rounded-full bg-accent-foreground" />}
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className={`text-[11px] ${active ? "opacity-80" : "text-muted"}`}>{desc}</div>
      </div>
    </button>
  );
}
