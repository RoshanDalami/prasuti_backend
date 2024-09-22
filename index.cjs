
import("./src/index.js")
  .then(({ default: app }) => {
    console.log('server started');
  })
  .catch((err) => {
    console.error("Error starting the application:", err);
  });
