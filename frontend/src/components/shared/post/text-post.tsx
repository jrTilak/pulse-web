const TextPost = ({ content }: { content: string }) => {
    return (
      <p className="ml-4" style={{ wordWrap: "break-word" }}>
        {content}
      </p>
    );
  };
  
  export default TextPost;