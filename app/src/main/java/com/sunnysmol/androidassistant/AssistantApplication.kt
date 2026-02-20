package com.sunnysmol.androidassistant

import android.app.Application
import com.justai.aimybox.Aimybox
import com.justai.aimybox.AimyboxProvider
import com.justai.aimybox.core.speechkit.GooglePlatformSpeechToText
import com.justai.aimybox.core.speechkit.GooglePlatformTextToSpeech
import com.justai.aimybox.dialog.AimyboxDialogApi
import com.justai.aimybox.dialog.Config
import com.justai.aimybox.dialog.Message
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.net.URI
import java.util.UUID

class AssistantApplication : Application(), AimyboxProvider {

    companion object {
        const val GATEWAY_URL = "ws://localhost:8080"
    }

    override val aimybox by lazy { createAimybox() }

    private fun createAimybox(): Aimybox {
        val unitId = UUID.randomUUID().toString()
        val textToSpeech = GooglePlatformTextToSpeech(this)
        val speechToText = GooglePlatformSpeechToText(this)

        // Use custom OpenClaw gateway instead of Aimybox API
        val dialogApi = OpenClawGatewayDialogApi(GATEWAY_URL)

        val config = Config.create(speechToText, textToSpeech, dialogApi)
        return Aimybox(config)
    }

    /**
     * Custom DialogApi implementation that connects to OpenClaw gateway via WebSocket
     */
    class OpenClawGatewayDialogApi(private val gatewayUrl: String) : AimyboxDialogApi {

        private val scope = CoroutineScope(Dispatchers.IO + Job())
        private var webSocket: WebSocketClient? = null

        override fun processQuery(query: String, callback: AimyboxDialogApi.Callback) {
            scope.launch {
                try {
                    connectIfNotConnected()

                    val message = JSONObject().apply {
                        put("type", "user")
                        put("content", query)
                        put("timestamp", System.currentTimeMillis())
                    }

                    webSocket?.send(message.toString())

                    // In real implementation, wait for response
                    // For now, echo back for demo
                    val response = Message(
                        type = Message.Type.ANSWER,
                        text = "Received: $query",
                        imageUrl = null
                    )
                    callback.onSuccess(response)
                } catch (e: Exception) {
                    callback.onError(e)
                }
            }
        }

        private fun connectIfNotConnected() {
            if (webSocket == null || webSocket?.isOpen == false) {
                val uri = URI.create(gatewayUrl)
                webSocket = WebSocketClient(uri)
                webSocket?.connect()
            }
        }
    }

    // Simple WebSocket client (for demo - use OkHttp in production)
    class WebSocketClient(private val uri: URI) {
        private var socket: java.net.WebSocket? = null

        val isOpen: Boolean
            get() = socket?.isOpen == true

        fun connect() {
            socket = java.net.URI.create(uri.toString()).toURL().openConnection() as java.net.WebSocket
        }

        fun send(message: String) {
            socket?.send(message)
        }
    }
}
