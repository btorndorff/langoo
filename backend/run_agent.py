import asyncio
import logging
from livekit.agents import WorkerOptions, cli
from utils.agent import entrypoint
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    load_dotenv()
    logger.info("Starting LiveKit agent...")

    try:
        cli.run_app(
            WorkerOptions(
                entrypoint_fnc=entrypoint,
            )
        )
    except Exception as e:
        logger.error(f"Error starting LiveKit agent: {str(e)}")
