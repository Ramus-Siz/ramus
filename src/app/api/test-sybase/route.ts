import { NextResponse } from "next/server";
import { Connection, Request, TYPES } from "tedious";

export async function GET() {
  const config = {
    server: "10.30.1.148",
    authentication: {
      type: "default" as const,
      options: {
        userName: "sa",
        password: "neptune64"
      }
    },
    options: {
      port: 10000,
      database: "banking",
      encrypt: false,
      trustServerCertificate: true,
      connectTimeout: 30000,
      requestTimeout: 30000
    }
  };

  return new Promise((resolve) => {
    let connection: Connection | null = null;
    let connectionTimeout: NodeJS.Timeout;

    // Timeout global pour éviter les connexions qui traînent
    const globalTimeout = setTimeout(() => {
      if (connection) {
        connection.close();
      }
      resolve(NextResponse.json({ 
        success: false, 
        error: "Connection timeout - Server took too long to respond",
        errorCode: "TIMEOUT"
      }, { status: 408 }));
    }, 45000);

    try {
      connection = new Connection(config);

      // Gestion des erreurs de connexion
      connection.on("connect", (err) => {
        clearTimeout(globalTimeout);
        
        if (err) {
          const errorMessage = err.message || "Unknown connection error";
          const errorCode = (err as any).code || "CONNECTION_ERROR";
          
          resolve(NextResponse.json({ 
            success: false, 
            error: `Connection failed: ${errorMessage}`,
            errorCode: errorCode,
            server: config.server,
            port: config.options.port
          }, { status: 500 }));
          return;
        }

        // Connexion réussie, exécution de la requête
        const request = new Request("SELECT GETDATE() AS currentDate", (err, rowCount) => {
          if (err) {
            connection?.close();
            const errorMessage = err.message || "Unknown query error";
            const errorCode = (err as any).code || "QUERY_ERROR";
            
            resolve(NextResponse.json({ 
              success: false, 
              error: `Query failed: ${errorMessage}`,
              errorCode: errorCode,
              rowCount: rowCount
            }, { status: 500 }));
            return;
          }
        });

        let result: any[] = [];
        
        // Gestion des erreurs lors de la lecture des lignes
        request.on("row", (columns: any[]) => {
          try {
            const row: any = {};
            columns.forEach((column: any) => {
              row[column.metadata.colName] = column.value;
            });
            result.push(row);
          } catch (rowError: any) {
            connection?.close();
            resolve(NextResponse.json({ 
              success: false, 
              error: `Row processing failed: ${rowError.message}`,
              errorCode: "ROW_PROCESSING_ERROR"
            }, { status: 500 }));
          }
        });

        // Fin de requête réussie
        request.on("requestCompleted", () => {
          connection?.close();
          resolve(NextResponse.json({ 
            success: true, 
            data: result,
            message: "Connection successful with tedious",
            server: config.server,
            database: config.options.database,
            timestamp: new Date().toISOString()
          }));
        });

        // Gestion des erreurs de requête
        request.on("error", (err) => {
          connection?.close();
          resolve(NextResponse.json({ 
            success: false, 
            error: `Request error: ${err.message}`,
            errorCode: "REQUEST_ERROR"
          }, { status: 500 }));
        });

        if (connection) {
          connection.execSql(request);
        }
      });

      // Gestion des erreurs de connexion générales
      connection.on("error", (err) => {
        clearTimeout(globalTimeout);
        const errorMessage = err.message || "Unknown connection error";
        const errorCode = (err as any).code || "CONNECTION_ERROR";
        
        resolve(NextResponse.json({ 
          success: false, 
          error: `Connection error: ${errorMessage}`,
          errorCode: errorCode
        }, { status: 500 }));
      });

      // Gestion de la fermeture inattendue
      connection.on("end", () => {
        clearTimeout(globalTimeout);
      });

      connection.connect();

    } catch (error: any) {
      clearTimeout(globalTimeout);
      resolve(NextResponse.json({ 
        success: false, 
        error: `Unexpected error: ${error.message}`,
        errorCode: "UNEXPECTED_ERROR",
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, { status: 500 }));
    }
  });
}
 