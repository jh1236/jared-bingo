from typing import Optional

from sqlalchemy import ForeignKey, Integer, REAL, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[Optional[str]] = mapped_column(Text)
    board: Mapped[Optional[float]] = mapped_column(REAL)
    state: Mapped[Optional[int]] = mapped_column(Integer)
    gambled_money: Mapped[Optional[int]] = mapped_column(Integer)
    score: Mapped[int] = mapped_column(Integer)

    items: Mapped[list['Items']] = relationship('Items', back_populates='player')


class Items(Base):
    __tablename__ = 'items'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    player_id: Mapped[Optional[int]] = mapped_column(ForeignKey('user.id'))
    name: Mapped[Optional[int]] = mapped_column(Integer)
    count: Mapped[Optional[int]] = mapped_column(Integer)

    player: Mapped[Optional['User']] = relationship('User', back_populates='items')


