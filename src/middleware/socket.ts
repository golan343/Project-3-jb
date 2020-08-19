import io from "socket.io-client"
import { Config } from "../config";
export const socket = io.connect(Config.serverUrl);