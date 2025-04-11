import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkDownComponentProps {
  children: string;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

interface CaseData {
  caseID?: string;
  caseTitle?: string;
  summary?: string;
}

type StyleObject = React.CSSProperties;

interface MarkdownStyles {
  [key: string]: StyleObject;
  h1: StyleObject;
  h2: StyleObject;
  h3: StyleObject;
  p: StyleObject;
  br: StyleObject;
  strong: StyleObject;
  em: StyleObject;
  ul: StyleObject;
  ol: StyleObject;
  li: StyleObject;
  a: StyleObject;
  blockquote: StyleObject;
  code: StyleObject;
  pre: StyleObject;
  table: StyleObject;
  th: StyleObject;
  td: StyleObject;
  caseTitle: StyleObject;
  caseContainer: StyleObject;
}

const styles: MarkdownStyles = {
  h1: { fontSize: "2em", margin: "0.67em 0", fontWeight: "bold" },
  h2: { fontSize: "1.5em", margin: "0.75em 0", fontWeight: "bold" },
  h3: { fontSize: "1.17em", margin: "0.83em 0", fontWeight: "bold" },
  p: { margin: "1em 0", lineHeight: 1.5, whiteSpace: "pre-wrap" },
  br: { display: "block", margin: "0.5em 0" },
  strong: { fontWeight: "bold" },
  em: { fontStyle: "italic" },
  ul: { margin: "1em 0", paddingLeft: "2em" },
  ol: { margin: "1em 0", paddingLeft: "2em" },
  li: { margin: "0.5em 0" },
  a: { color: "#0066cc", textDecoration: "underline" },
  blockquote: {
    borderLeft: "4px solid #ddd",
    paddingLeft: "1em",
    color: "#666",
    margin: "1em 0",
  },
  code: {
    backgroundColor: "#f5f5f5",
    padding: "0.2em 0.4em",
    borderRadius: "3px",
    fontFamily: "monospace",
  },
  pre: {
    backgroundColor: "#f5f5f5",
    padding: "1em",
    borderRadius: "4px",
    overflow: "auto",
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    margin: "1em 0",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  },
  caseTitle: {
    fontWeight: "bold",
    fontSize: "1.2em",
    marginBottom: "0.5em",
  },
  caseContainer: {
    marginBottom: "2em",
    paddingBottom: "1em",
    borderBottom: "1px solid #eee",
  },
};

const MarkDownComponent: React.FC<MarkDownComponentProps> = ({ children }) => {
  const renderMarkdown = (content: string) => (
    <ReactMarkdown
      components={{
        h1: ({ ...props }) => <h1 style={styles.h1} {...props} />,
        h2: ({ ...props }) => <h2 style={styles.h2} {...props} />,
        h3: ({ ...props }) => <h3 style={styles.h3} {...props} />,
        p: ({ ...props }) => <p style={styles.p} {...props} />,
        br: ({ ...props }) => <br style={styles.br} {...props} />,
        strong: ({ ...props }) => <strong style={styles.strong} {...props} />,
        em: ({ ...props }) => <em style={styles.em} {...props} />,
        ul: ({ ...props }) => <ul style={styles.ul} {...props} />,
        ol: ({ ...props }) => <ol style={styles.ol} {...props} />,
        li: ({ ...props }) => <li style={styles.li} {...props} />,
        a: ({ ...props }) => (
          <a
            style={styles.a}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        blockquote: ({ ...props }) => (
          <blockquote style={styles.blockquote} {...props} />
        ),
        code: ({ inline, ...props }: CodeProps) => (
          <code style={inline ? styles.code : undefined} {...props} />
        ),
        pre: ({ ...props }) => <pre style={styles.pre} {...props} />,
        table: ({ ...props }) => <table style={styles.table} {...props} />,
        th: ({ ...props }) => <th style={styles.th} {...props} />,
        td: ({ ...props }) => <td style={styles.td} {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );

  try {
    const parsedData = JSON.parse(children) as CaseData[];

    if (Array.isArray(parsedData) && parsedData.length > 0) {
      return (
        <div>
          {parsedData.map((caseData, index) => {
            if (!caseData.summary) return null;

            const markdownContent = caseData.summary
              .replace(/^### Summary of the Case:.*?\n\n/, "")
              .trim();

            return (
              <div key={caseData.caseID || index} style={styles.caseContainer}>
                {caseData.caseTitle && (
                  <div style={styles.caseTitle}>
                    <strong>{caseData.caseTitle}</strong>
                  </div>
                )}
                {renderMarkdown(markdownContent)}
              </div>
            );
          })}
        </div>
      );
    }
  } catch (error) {
    console.log("Content is not JSON, rendering as plain markdown", error);
  }

  return renderMarkdown(children);
};

export default MarkDownComponent;
