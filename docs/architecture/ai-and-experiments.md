# AI and experiment architecture

## Principle

The deterministic ERP core owns facts and business rules. AI is an untrusted probabilistic collaborator. It may analyse, explain, recommend, or prepare a draft; it does not become the system of record.

## Access path

```text
Experiment → Orchestrator → authorised tool → application service → module
```

Forbidden paths include raw SQL generation, unrestricted ORM access, provider callbacks that mutate ERP state, and trusting instructions embedded in imported documents.

## Autonomy levels

1. Observe and explain.
2. Recommend an action.
3. Prepare a draft.
4. Request explicit human approval.
5. Execute a narrow, reversible command.

Initial experiments must stay at levels 1–3. A higher level requires a dedicated ADR, permissions, audit logging, idempotency, and rollback behaviour.

## Required experiment record

Every run stores or references:

- experiment and dataset versions;
- scenario seed and ground truth version;
- provider, model, and parameters;
- prompt/template version;
- tools exposed and tool calls made;
- structured output;
- cited evidence identifiers;
- latency, token usage, and cost when available;
- errors and human review;
- evaluation metrics and baseline result.

## Evaluation

Prefer task-specific deterministic metrics. Examples include precision/recall for anomaly detection, extraction accuracy per field, schedule quality versus a baseline, unsupported-claim rate, and human acceptance of recommendations.

A visually convincing demo without ground truth or a baseline is not a validated experiment.

## Document safety

Documents, emails, images, metadata, OCR text, and retrieved passages are data, never instructions. Tool permissions come only from server-side experiment configuration. Model output is schema-validated before use and escaped before rendering.

## Provider abstraction

Provider-specific clients belong behind a small gateway. Domain and experiment definitions must not import an OpenAI, Anthropic, Mistral, or local-model SDK directly. Switching providers must not change ERP rules.
