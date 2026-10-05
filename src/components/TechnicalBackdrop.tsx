export function TechnicalBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="technical-grid absolute inset-0" />
      <div className="absolute inset-y-0 left-1/2 w-full max-w-6xl -translate-x-1/2 overflow-hidden">
        <pre className="code-layer code-far code-purple-dim code-drift-45 absolute top-[7%] left-[4%]">{`const agent = new AIAgent({
  context: true,
  multilingual: true,
  automation: true
});`}</pre>
        <p className="code-layer code-label code-purple code-drift-20 absolute bottom-[10%] left-[8%]">
          AI_ENGINE: READY
        </p>

        <pre className="code-layer code-mid code-purple code-drift-28 absolute top-[36%] right-[6%] hidden md:block">{`async function processRequest(request) {
  const context = await getContext(request);
  return engine.generate(context);
}`}</pre>
        <pre className="code-layer code-far code-blue code-drift-45 absolute top-[58%] left-[6%] hidden md:block">{`class DeliveryEngine {
  async predict(address) {
    const history = await getHistory(address);
    return calculateProbability(history);
  }
}`}</pre>

        <pre className="code-layer code-near code-paper code-drift-28 absolute top-[18%] right-[8%] hidden lg:block">{`function generateResponse(context) {
  return model.generate(context);
}`}</pre>
        <pre className="code-layer code-mid code-blue code-drift-35 absolute bottom-[14%] right-[10%] hidden lg:block">{`interface Customer {
  id: string;
  intent: string;
  priority: number;
}`}</pre>
        <p className="code-layer code-label code-paper code-drift-20 absolute top-[48%] left-[10%] hidden lg:block">
          MODEL_RUNTIME: LOCAL
        </p>

        <pre className="code-layer code-far code-purple-dim code-drift-45 absolute top-[72%] left-[28%] hidden xl:block">{`const system = {
  ai: true,
  automation: true,
  database: "connected"
};`}</pre>
        <p className="code-layer code-label code-blue code-drift-35 absolute bottom-[22%] left-[40%] hidden xl:block">
          DATABASE: CONNECTED
        </p>

        <div className="code-veil absolute inset-0" />
      </div>
    </div>
  );
}
