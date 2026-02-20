package com.sunnysmol.androidassistant

import android.app.Application
import com.justai.aimybox.Aimybox
import com.justai.aimybox.AimyboxProvider
import com.justai.aimybox.core.speechkit.GooglePlatformSpeechToText
import com.justai.aimybox.core.speechkit.GooglePlatformTextToSpeech
import com.justai.aimybox.dialog.AimyboxDialogApi
import com.justai.aimybox.dialog.Config
import java.util.UUID

class AssistantApplication : Application(), AimyboxProvider {

    companion object {
        private const val AIMYBOX_API_KEY = "your-api-key-here"
    }

    override val aimybox by lazy { createAimybox() }

    private fun createAimybox(): Aimybox {
        val unitId = UUID.randomUUID().toString()
        val textToSpeech = GooglePlatformTextToSpeech(this)
        val speechToText = GooglePlatformSpeechToText(this)
        val dialogApi = AimyboxDialogApi(AIMYBOX_API_KEY, unitId)

        val config = Config.create(speechToText, textToSpeech, dialogApi)
        return Aimybox(config)
    }
}
