from __future__ import annotations

import logging
from dotenv import load_dotenv

from livekit import rtc
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    llm,
)
from livekit.agents.multimodal import MultimodalAgent
from livekit.plugins import openai
import json


load_dotenv()
logger = logging.getLogger("my-worker")
logger.setLevel(logging.INFO)

INSTRUCTIONS = """
You are a voice assistant created by Langoo a language learning app. Your task is to help users practice speaking the language they are learning.

Your current user is {username} and is a beginner learning {language} with a {accent_instruction} accent.

the user wants to practice the following:
{user_instructions}
"""


async def entrypoint(
    ctx: JobContext,
):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    participant = await ctx.wait_for_participant()

    run_multimodal_agent(ctx, participant)

    logger.info("agent started")


def run_multimodal_agent(
    ctx: JobContext,
    participant: rtc.Participant,
):
    logger.info("starting multimodal agent")
    metadata = json.loads(participant.metadata)

    instructions = INSTRUCTIONS.format(
        username=metadata["username"],
        language=metadata["language"],
        accent_instruction=metadata["accent"],
        user_instructions=metadata["user_instructions"],
    )

    model = openai.realtime.RealtimeModel(
        instructions=instructions,
        modalities=["audio", "text"],
    )
    assistant = MultimodalAgent(model=model)
    assistant.start(ctx.room, participant)

    session = model.sessions[0]
    session.conversation.item.create(
        llm.ChatMessage(
            role="assistant",
            content="Please begin the interaction with the user in a manner consistent with your instructions.",
        )
    )
    session.response.create()
