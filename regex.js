function someFunction(markdown) {
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]*)")?\)/g;
    const links = [];
    let match;
  
    while ((match = regex.exec(markdown)) !== null) {
      links.push({
        text: match[1],            
        url: match[2],              
        title: match[3] || null    
      }); 
    }
  
    return links;
  }
  
  // Demo:
  const md = 'Check [OpenAI](https://openai.com "OpenAI Homepage") and [GitHub](https://github.com).';
  console.log(someFunction(md));